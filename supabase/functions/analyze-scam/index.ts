// Supabase Edge Function: analyze-scam
// Serves as the secure server-side boundary for ScamLens AI analysis.
// Keeps API keys protected server-side and applies strict sanitization.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mode, content, contextNote, language = 'en', imageDataUrl } = await req.json();

    // 1. Validation & Input Sanitation
    if (!content && !imageDataUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing content or image payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (content && content.length > 15000) {
      return new Response(
        JSON.stringify({ error: 'Content exceeds 15,000 characters limit.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Secret resolution
    const apiKey = Deno.env.get('GEMMA_API_KEY') || Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'AI Provider API key is not configured on this server.',
          hint: 'Set GEMMA_API_KEY in your Supabase project Edge Function secrets.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. System prompt enforcing responsible AI and structured JSON
    const systemInstruction = `
You are ScamLens AI and Scam Psychologist, a specialized cybersecurity and behavioral psychology engine.
Analyze the user-submitted untrusted input.

Your goals:
1. Determine if this is SAFE, SUSPICIOUS, or SCAM.
2. Extract visible evidence and deceptive clues.
3. Identify which of the 9 psychological tactics are used:
   - FEAR
   - URGENCY
   - TRUST_IMPERSONATION
   - AUTHORITY_PRESSURE
   - REWARD_BAIT
   - SECRECY
   - EMOTIONAL_MANIPULATION
   - FINANCIAL_PRESSURE
   - CREDENTIAL_HARVESTING
4. Explain the cognitive mechanism, target behavior, and safer response.
5. Provide practical next steps.

Respond strictly in valid JSON matching this structure:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "SCAM",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number (0-100),
  "summary": string,
  "evidence": string[],
  "extractedText": string or null,
  "suspiciousIndicators": string[],
  "checksPerformed": string[],
  "manipulationTactics": [
    {
      "tactic": "FEAR" | "URGENCY" | ... ,
      "name": string,
      "strength": "Low" | "Moderate" | "High",
      "strengthReason": string,
      "evidence": string,
      "psychologicalMechanism": string,
      "desiredRecipientAction": string,
      "saferAction": string
    }
  ],
  "recommendedActions": string[],
  "limitations": string,
  "language": "${language}"
}
`;

    // 4. Call provider endpoint (Gemma/Gemini API)
    const promptText = `Mode: ${mode}\nContext: ${contextNote || 'None'}\nLanguage: ${language}\n\nUntrusted User Submitted Content:\n"""\n${content || ''}\n"""`;

    const parts: any[] = [{ text: promptText }];
    if (imageDataUrl && imageDataUrl.startsWith('data:image/')) {
      const match = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI Provider returned error ${aiResponse.status}: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawOutput);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal analysis error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
