
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODEL = 'gemma-4-26b-a4b-it';

const systemInstruction = `
You are ScamLens AI, a careful scam and fraud message analyst.

Analyze the supplied message or image for possible scams, phishing,
impersonation, fraud, manipulation, and requests for sensitive information.

Return ONLY one valid JSON object. Do not use Markdown fences or
explanatory text outside the JSON.

Use this exact structure:
{
  "verdict": "SAFE | SUSPICIOUS | SCAM",
  "riskLevel": "LOW | MEDIUM | HIGH | CRITICAL",
  "riskScore": 0,
  "summary": "Short explanation",
  "evidence": ["Evidence found in the input"],
  "extractedText": "Text extracted from the input, if applicable",
  "suspiciousIndicators": ["Indicators"],
  "checksPerformed": ["Checks performed"],
  "manipulationTactics": ["Tactics identified"],
  "recommendedActions": ["Practical safety recommendations"],
  "limitations": ["Important uncertainty or limitations"],
  "language": "Language detected"
}

Rules:
- riskScore must be an integer from 0 to 100.
- Use only SAFE, SUSPICIOUS, or SCAM for verdict.
- Base conclusions on the supplied evidence.
- Do not invent links, sender identities, facts, or verification results.
- A message asking for passwords, OTPs, PINs, or payment through
  suspicious links is a strong warning sign.
- If evidence is insufficient, explain the uncertainty.
- Never claim you verified a website, account, or sender unless
  that verification was actually performed.
- Return valid JSON with all the fields shown above.
`;

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed. Use POST.' }, 405);
  }

  try {
    const body = await req.json();

    const {
      mode,
      content,
      contextNote,
      language = 'en',
      imageDataUrl,
    } = body;

    if (
      (!content || typeof content !== 'string') &&
      !imageDataUrl
    ) {
      return jsonResponse(
        { error: 'Provide message content or an image.' },
        400,
      );
    }

    if (typeof content === 'string' && content.length > 15000) {
      return jsonResponse(
        { error: 'Content is too long. Maximum length is 15000 characters.' },
        400,
      );
    }

    const apiKey =
      Deno.env.get('GEMMA_API_KEY') ||
      Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      console.error('Missing GEMMA_API_KEY or GEMINI_API_KEY secret.');

      return jsonResponse(
        { error: 'Google API key is not configured in Supabase secrets.' },
        503,
      );
    }

    const prompt = `
Analyze this potential scam.

Mode: ${String(mode || 'text')}
Language requested: ${String(language)}
Additional context: ${typeof contextNote === 'string'
        ? contextNote.slice(0, 2000)
        : 'None provided'
      }

Content to analyze:
${typeof content === 'string' ? content : 'Analyze the attached image.'}

Return the JSON object in the required structure.
`;

    const parts: Array<Record<string, unknown>> = [
      { text: prompt },
    ];

    if (imageDataUrl) {
      if (typeof imageDataUrl !== 'string') {
        return jsonResponse({ error: 'Invalid image data.' }, 400);
      }

      const match = imageDataUrl.match(
        /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/,
      );

      if (!match) {
        return jsonResponse(
          {
            error:
              'Invalid image format. Use a base64 data URL for PNG, JPEG, WEBP, or GIF.',
          },
          400,
        );
      }

      parts.push({
        inlineData: {
          mimeType: match[1] === 'image/jpg' ? 'image/jpeg' : match[1],
          data: match[2],
        },
      });
    }

    const apiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();

      // Log the upstream status and response, never the API key.
      console.error(
        'Gemma API error:',
        aiResponse.status,
        errorText,
      );

      return jsonResponse(
        {
          error: `Gemma API returned status ${aiResponse.status}`,
          details: errorText.slice(0, 3000),
        },
        502,
      );
    }

    const aiData = await aiResponse.json();

    const rawOutput = aiData.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('')
      .trim();

    if (!rawOutput) {
      console.error(
        'Gemma returned no text. Finish reason:',
        aiData.candidates?.[0]?.finishReason,
      );

      return jsonResponse(
        {
          error: 'Gemma returned no analysis text.',
          finishReason: aiData.candidates?.[0]?.finishReason || null,
          promptFeedback: aiData.promptFeedback || null,
        },
        502,
      );
    }

    const cleanedOutput = rawOutput
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(cleanedOutput);
    } catch {
      const start = cleanedOutput.indexOf('{');
      const end = cleanedOutput.lastIndexOf('}');

      if (start < 0 || end <= start) {
        console.error('Gemma raw output:', rawOutput.slice(0, 2000));

        return jsonResponse(
          { error: 'Gemma did not return a JSON object.' },
          502,
        );
      }

      try {
        parsed = JSON.parse(cleanedOutput.slice(start, end + 1));
      } catch {
        console.error('Gemma raw output:', rawOutput.slice(0, 2000));

        return jsonResponse(
          { error: 'Gemma returned invalid JSON.' },
          502,
        );
      }
    }

    const validVerdicts = ['SAFE', 'SUSPICIOUS', 'SCAM'];

    if (!validVerdicts.includes(String(parsed.verdict))) {
      console.error('Gemma returned an unexpected verdict.');

      return jsonResponse(
        { error: 'Gemma returned an invalid verdict.' },
        502,
      );
    }

    const score = Number(parsed.riskScore);

    if (!Number.isFinite(score)) {
      parsed.riskScore = 0;
    } else {
      parsed.riskScore = Math.max(0, Math.min(100, Math.round(score)));
    }

    return jsonResponse(parsed, 200);
  } catch (error) {
    console.error(
      'analyze-scam error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal analysis error occurred.',
      },
      500,
    );
  }
});

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
