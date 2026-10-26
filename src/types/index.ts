export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AnalysisMode = 'message' | 'email' | 'url' | 'screenshot' | 'qr';

export type TacticCategory =
  | 'FEAR'
  | 'URGENCY'
  | 'TRUST_IMPERSONATION'
  | 'AUTHORITY_PRESSURE'
  | 'REWARD_BAIT'
  | 'SECRECY'
  | 'EMOTIONAL_MANIPULATION'
  | 'FINANCIAL_PRESSURE'
  | 'CREDENTIAL_HARVESTING';

export type TacticStrength = 'Low' | 'Moderate' | 'High';

export interface PsychologicalTactic {
  tactic: TacticCategory;
  name: string;
  strength: TacticStrength;
  strengthReason: string;
  evidence: string;
  psychologicalMechanism: string;
  desiredRecipientAction: string;
  saferAction: string;
}

export interface AnalysisResult {
  id: string;
  status: 'success' | 'demo' | 'error';
  verdict: Verdict;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 heuristic
  summary: string;
  evidence: string[];
  extractedText?: string;
  suspiciousIndicators: string[];
  checksPerformed: string[];
  manipulationTactics: PsychologicalTactic[];
  recommendedActions: string[];
  limitations: string;
  language: string;
  analysisMode: AnalysisMode;
  timestamp: string;
  isDemo: boolean;
  disclaimer: string;
}

export interface UrlInspectionResult {
  url: string;
  isValid: boolean;
  protocol: string;
  hostname: string;
  pathname: string;
  isIpHost: boolean;
  isLookalikeOrTyposquat: boolean;
  hasMisleadingSubdomain: boolean;
  isShortener: boolean;
  usesHttps: boolean;
  hasSuspiciousKeywords: boolean;
  suspiciousFlags: string[];
  checksSummary: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  isDemoUser: boolean;
  avatarUrl?: string;
  created_at?: string;
}

export type SupportedLanguage =
  | 'en' // English
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'es' // Spanish
  | 'fr'; // French

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}
