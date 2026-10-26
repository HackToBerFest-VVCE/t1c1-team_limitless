import { AnalysisMode, AnalysisResult, RiskLevel, Verdict } from '../types';
import { inspectUrl } from './urlAnalyzer';
import { analyzePsychologicalTactics } from './psychologistEngine';
import { isSupabaseConfigured, supabase } from './supabase';

export interface AnalysisInput {
  mode: AnalysisMode;
  content: string;
  imageDataUrl?: string;
  contextNote?: string;
  language?: string;
}

/**
 * Calculates a heuristic risk assessment when analyzing offline or in demo mode.
 * Honest: Not a guarantee of safety or calibrated probability.
 */
function calculateLocalAnalysis(input: AnalysisInput): AnalysisResult {
  const { mode, content, contextNote, language = 'en' } = input;
  const combinedText = `${content} ${contextNote || ''}`.trim();

  // 1. Analyze psychological tactics
  const tactics = analyzePsychologicalTactics(combinedText);

  // 2. Perform URL inspection if input is a URL or contains URLs
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi;
  const urlsFound = combinedText.match(urlRegex) || [];
  const urlInspections = urlsFound.map((u) => inspectUrl(u));
  const suspiciousUrlFlags = urlInspections.flatMap((u) => u.suspiciousFlags);

  // 3. Evaluate indicators
  const evidence: string[] = [];
  const suspiciousIndicators: string[] = [];
  const checksPerformed: string[] = [
    'Syntactic and pattern verification',
    'Psychological coercion tactic extraction',
    'Credential harvesting keyword inspection',
  ];

  if (urlsFound.length > 0) {
    checksPerformed.push(`URL structure inspection (${urlsFound.length} link${urlsFound.length > 1 ? 's' : ''} evaluated)`);
  }

  // Factor in tactics
  for (const t of tactics) {
    evidence.push(`${t.name} (${t.strength} intensity): ${t.evidence}`);
    suspiciousIndicators.push(`Manipulation tactic: ${t.name}`);
  }

  // Factor in URL flags
  for (const flag of suspiciousUrlFlags) {
    evidence.push(flag);
    suspiciousIndicators.push(flag);
  }

  // Check specific common scam indicators
  const lower = combinedText.toLowerCase();
  if (lower.includes('otp') || lower.includes('one time password') || lower.includes('6-digit code')) {
    evidence.push('Direct solicitation of single-use verification code (OTP). High risk of immediate account takeover.');
    suspiciousIndicators.push('OTP / PIN solicitation');
  }

  if (lower.includes('gift card') || lower.includes('apple card') || lower.includes('steam card')) {
    evidence.push('Request for non-reversible gift card payment rails, universally associated with fraud.');
    suspiciousIndicators.push('Untraceable gift card payment request');
  }

  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('seed phrase')) {
    evidence.push('Cryptocurrency transfer or private seed phrase request.');
    suspiciousIndicators.push('Cryptocurrency / wallet drain risk');
  }

  // Determine heuristic risk score and verdict
  let riskScore = 10;
  if (tactics.some((t) => t.strength === 'High') || suspiciousUrlFlags.length >= 2) {
    riskScore += 55;
  } else if (tactics.some((t) => t.strength === 'Moderate') || suspiciousUrlFlags.length === 1) {
    riskScore += 35;
  } else if (tactics.length > 0) {
    riskScore += 20;
  }

  // Add weight for multiple tactics
  if (tactics.length >= 3) {
    riskScore += 20;
  } else if (tactics.length === 2) {
    riskScore += 10;
  }

  // Bound between 5 and 98
  riskScore = Math.min(Math.max(riskScore, 5), 98);

  let verdict: Verdict = 'SAFE';
  let riskLevel: RiskLevel = 'LOW';

  if (riskScore >= 70) {
    verdict = 'SCAM';
    riskLevel = riskScore >= 85 ? 'CRITICAL' : 'HIGH';
  } else if (riskScore >= 35) {
    verdict = 'SUSPICIOUS';
    riskLevel = 'MEDIUM';
  } else {
    verdict = 'SAFE';
    riskLevel = 'LOW';
  }

  // Build plain-language summary
  let summary = '';
  if (verdict === 'SCAM') {
    summary = `Strong indications of deceptive intent detected. The content employs ${tactics.map((t) => t.name).join(' and ') || 'suspicious patterns'} and deceptive URLs designed to compromise your security or finances.`;
  } else if (verdict === 'SUSPICIOUS') {
    summary = `Concerning indicators were detected, but evidence is inconclusive. Exercise caution and verify through a trusted secondary channel before interacting.`;
  } else {
    summary = `No high-risk scam indicators or obvious psychological manipulation patterns were identified in the submitted text. However, this is not a guarantee of safety. Always remain vigilant.`;
    evidence.push('No emergency ultimatums, credential harvesting, or known deceptive URL structures detected.');
  }

  // Recommended actions
  const recommendedActions: string[] = [];
  if (verdict === 'SCAM' || verdict === 'SUSPICIOUS') {
    recommendedActions.push('Do NOT click any links, open attachments, or send funds.');
    recommendedActions.push('Do NOT share passwords, OTPs, PINs, or national identity numbers.');
    recommendedActions.push('Contact the organization directly through their verified official website or mobile app.');
    recommendedActions.push('Block the sender and report the communication to local cyber authorities.');
  } else {
    recommendedActions.push('Verify the sender address independently if unexpected.');
    recommendedActions.push('Keep multi-factor authentication (MFA) enabled across your accounts.');
    recommendedActions.push('Never forward verification codes even if requested by known contacts.');
  }

  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: 'demo',
    verdict,
    riskLevel,
    riskScore,
    summary,
    evidence,
    extractedText: input.mode === 'screenshot' ? (content || 'Extracted visible message text from image preview.') : undefined,
    suspiciousIndicators,
    checksPerformed,
    manipulationTactics: tactics,
    recommendedActions,
    limitations:
      'Heuristic evaluation based strictly on user-supplied content. Does not verify backend telecom headers or real sender server logs.',
    language,
    analysisMode: mode,
    timestamp: new Date().toISOString(),
    isDemo: true,
    disclaimer: 'DEMO RESULT — NOT A LIVE SECURITY CHECK.',
  };
}

/**
 * Main analysis entrypoint. Attempts live Supabase Edge Function call if configured.
 * If unconfigured or server fails, returns deterministic, clearly labeled demo result.
 */
export async function analyzeScamContent(input: AnalysisInput): Promise<AnalysisResult> {
  // Input sanity validation
  if (!input.content && !input.imageDataUrl) {
    throw new Error('Please provide content or an image to analyze.');
  }

  if (input.content && input.content.length > 15000) {
    throw new Error('Submitted content exceeds the maximum limit of 15,000 characters.');
  }

  // Check if live Supabase backend is configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-scam', {
        body: {
          mode: input.mode,
          content: input.content,
          contextNote: input.contextNote,
          language: input.language || 'en',
          imageDataUrl: input.imageDataUrl ? input.imageDataUrl.slice(0, 500000) : undefined, // protect payload size
        },
      });

      if (!error && data && data.verdict) {
        return {
          ...data,
          status: 'success',
          isDemo: false,
          disclaimer: 'Verified analysis processed via secure backend service.',
        };
      }
    } catch (err) {
      console.warn('Backend Edge Function call failed or unconfigured, falling back to client engine:', err);
    }
  }

  // Return honest client-side / demo result
  // Simulate natural realistic processing latency for UX polish (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));
  return calculateLocalAnalysis(input);
}
