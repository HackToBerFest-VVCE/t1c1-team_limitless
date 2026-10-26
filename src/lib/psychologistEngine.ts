import { PsychologicalTactic, TacticCategory } from '../types';

interface TacticDefinition {
  category: TacticCategory;
  name: string;
  keywords: string[];
  patterns: RegExp[];
  mechanism: string;
  desiredAction: string;
  saferAction: string;
  strengthCriteria: (matches: string[]) => { strength: 'Low' | 'Moderate' | 'High'; reason: string };
}

const TACTIC_DEFINITIONS: TacticDefinition[] = [
  {
    category: 'FEAR',
    name: 'Fear & Threat Induction',
    keywords: [
      'suspended',
      'terminated',
      'legal action',
      'arrest',
      'court',
      'lawsuit',
      'police',
      'penalty',
      'freeze',
      'blocked',
      'violation',
      'criminal',
      'warrant',
      'deactivated',
      'immediate action required to prevent',
    ],
    patterns: [
      /account (will be|has been) (suspended|blocked|terminated|closed)/i,
      /(legal action|law enforcement|police|court warrant|fine)/i,
      /fail(ure)? to comply will result in/i,
      /immediate suspension/i,
    ],
    mechanism:
      'Triggers the amygdala and fight-or-flight response, causing panic that short-circuits critical thinking and analytical evaluation.',
    desiredAction:
      'Comply immediately without pausing to verify whether the threat is genuine or legally possible.',
    saferAction:
      'Pause and breathe. Legitimate institutions (banks, courts, police) do not send emergency threats via informal SMS or email.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /police|arrest|lawsuit|warrant/i.test(m))) {
        return { strength: 'High', reason: 'Explicit threat of law enforcement, arrest, or severe legal penalty.' };
      }
      if (matches.length >= 2) {
        return { strength: 'Moderate', reason: 'Multiple account blockage and deactivation warnings detected.' };
      }
      return { strength: 'Low', reason: 'Mild cautionary tone regarding account status.' };
    },
  },
  {
    category: 'URGENCY',
    name: 'Artificial Urgency & Time Compression',
    keywords: [
      'urgent',
      'immediately',
      'within 24 hours',
      'within 2 hours',
      'expires in',
      'act now',
      'limited time',
      'don\'t wait',
      'last chance',
      'hurry',
      'before it\'s too late',
      'today only',
      'instant',
    ],
    patterns: [
      /(within|in) (\d{1,2}|24|48) hours/i,
      /(act|respond|click|verify) (now|immediately|urgently)/i,
      /expires (today|soon|in \d+ mins?)/i,
      /time-sensitive/i,
    ],
    mechanism:
      'Imposes artificial time limits to induce cognitive overload, reducing the mental bandwidth available to spot inconsistencies.',
    desiredAction:
      'Rush through authentication or payment before you have time to consult others or inspect the details.',
    saferAction:
      'Deliberately slow down. Scammers manufacture emergencies because urgency prevents rational verification.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /immediately|within \d+ hours|expires in/i.test(m))) {
        return { strength: 'High', reason: 'Tight, aggressive deadline designed to force an impulse reaction.' };
      }
      if (matches.length >= 2) {
        return { strength: 'Moderate', reason: 'Repeated urging to act quickly.' };
      }
      return { strength: 'Low', reason: 'Standard prompt to respond promptly.' };
    },
  },
  {
    category: 'TRUST_IMPERSONATION',
    name: 'Trust Impersonation & Identity Hijacking',
    keywords: [
      'bank',
      'support',
      'security team',
      'customer service',
      'fraud department',
      'amazon',
      'apple',
      'paypal',
      'fedex',
      'dhl',
      'usps',
      'postal service',
      'government',
      'tax department',
      'irs',
      'income tax',
      'hr department',
      'it support',
    ],
    patterns: [
      /(from|dear) (customer|client|user|member)/i,
      /(official|authorized) notice from/i,
      /(bank|service) fraud (department|prevention|unit)/i,
      /(delivery|package|parcel) (pending|failed|held)/i,
    ],
    mechanism:
      'Exploits our natural cognitive heuristic of trusting established brands, institutions, and authority figures without inspecting domain headers.',
    desiredAction:
      'Trust the sender blindly and transfer your confidence in the real brand to this fake message.',
    saferAction:
      'Never trust sender names on SMS or email headers. Always open your official app or manually type the official website address.',
    strengthCriteria: (matches) => {
      if (matches.length >= 2) {
        return { strength: 'High', reason: 'Detailed imitation of a known bank, courier, or government entity.' };
      }
      return { strength: 'Moderate', reason: 'General claim of representing a corporate or service support desk.' };
    },
  },
  {
    category: 'AUTHORITY_PRESSURE',
    name: 'Authority Pressure & Hierarchy Dominance',
    keywords: [
      'command',
      'direct order',
      'directive',
      'compliance officer',
      'executive office',
      'ceo',
      'director',
      'investigation unit',
      'federal',
      'do not question',
      'mandatory compliance',
    ],
    patterns: [
      /by order of/i,
      /mandatory (audit|inspection|compliance|update)/i,
      /executive (directive|request)/i,
      /strictly prohibited to ignore/i,
    ],
    mechanism:
      'Leverages social obedience reflexes (Milgram effect), making people reluctant to question someone who claims higher rank or institutional power.',
    desiredAction:
      'Submit to the directive without asking for second-opinion confirmation from peers or supervisors.',
    saferAction:
      'Verify executive requests through a secondary channel (such as a known internal phone extension or in-person check).',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /federal|investigation|ceo|director|mandatory compliance/i.test(m))) {
        return { strength: 'High', reason: 'Overt claim of legal, regulatory, or corporate executive power.' };
      }
      return { strength: 'Moderate', reason: 'Formal bureaucratic insistence on obedience.' };
    },
  },
  {
    category: 'REWARD_BAIT',
    name: 'Reward Bait & Greed/Dopamine Exploitation',
    keywords: [
      'winner',
      'won',
      'lottery',
      'prize',
      'selected',
      'free gift',
      'cashback',
      'crypto bonus',
      'exclusive reward',
      'unclaimed funds',
      'inheritance',
      'grant',
      'lucky draw',
      'refund approved',
    ],
    patterns: [
      /congratulations! you (have been|are) (selected|chosen|the winner)/i,
      /claim your \$?[\d,]+ (prize|reward|refund|bonus)/i,
      /you won (a|an) (iphone|gift card|cash)/i,
    ],
    mechanism:
      'Triggers a dopamine spike by offering unearned windfalls, blinding the victim to the irrationality of giving personal info to claim free money.',
    desiredAction:
      'Click the link or pay an "advance processing fee" to claim an imaginary reward.',
    saferAction:
      'Remember the foundational rule: You cannot win a contest or lottery you never entered. Genuine companies never ask you to pay a fee to receive a prize.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /won|winner|lottery|unclaimed funds/i.test(m))) {
        return { strength: 'High', reason: 'Promising large financial sum or valuable device with zero upfront justification.' };
      }
      return { strength: 'Moderate', reason: 'Offer of voucher, refund, or discount incentive.' };
    },
  },
  {
    category: 'SECRECY',
    name: 'Secrecy & Isolation Manipulation',
    keywords: [
      'do not tell',
      'keep this confidential',
      'confidentiality required',
      'private matter',
      'do not discuss with bank staff',
      'keep secret',
      'tell no one',
      'discreet',
      'between us',
      'sensitive investigation',
    ],
    patterns: [
      /do not (discuss|mention|disclose) this to (anyone|bank|staff|family)/i,
      /keep this (strictly )?confidential/i,
      /for your eyes only/i,
    ],
    mechanism:
      'Isolates the target from their support network, preventing family, colleagues, or bank tellers from pointing out the scam.',
    desiredAction:
      'Keep quiet and avoid asking advice from someone who would recognize the fraud.',
    saferAction:
      'Any instruction to hide a financial transaction or communication from your family or bank is an absolute red flag. Speak to someone you trust immediately.',
    strengthCriteria: () => ({
      strength: 'High',
      reason: 'Deliberate command to hide interaction from advisors, bank staff, or family.',
    }),
  },
  {
    category: 'EMOTIONAL_MANIPULATION',
    name: 'Emotional Leverage & Guilt/Sympathy',
    keywords: [
      'emergency',
      'hospital',
      'accident',
      'help me please',
      'stranded',
      'lost my wallet',
      'in trouble',
      'favor',
      'desperate',
      'dying',
      'cancer',
      'orphan',
      'heartbroken',
    ],
    patterns: [
      /(i am|i'm) (stranded|in the hospital|in jail)/i,
      /please help me, i have no one else/i,
      /can you do me a huge favor/i,
      /send money quickly for treatment/i,
    ],
    mechanism:
      'Exploits human empathy, affection, and kindness, making the victim feel guilty or selfish if they hesitate to help.',
    desiredAction:
      'Send immediate emergency money or gift cards without calling the alleged friend or relative to verify.',
    saferAction:
      'Call the friend or relative on their known original phone number or ask a shared acquaintance before sending any funds.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /hospital|accident|stranded|emergency/i.test(m))) {
        return { strength: 'High', reason: 'Fabricated life-or-death personal crisis to force hasty emotional money transfers.' };
      }
      return { strength: 'Moderate', reason: 'Subtle guilt-tripping or relationship pressure.' };
    },
  },
  {
    category: 'FINANCIAL_PRESSURE',
    name: 'Unusual Financial Coercion',
    keywords: [
      'wire transfer',
      'bitcoin',
      'crypto',
      'gift card',
      'apple card',
      'google play card',
      'steam card',
      'moneygram',
      'western union',
      'deposit now',
      'transfer to safe account',
      'overdue fee',
      'clearance fee',
    ],
    patterns: [
      /(pay|purchase|buy) (with |via )?(gift cards?|bitcoin|crypto|usdt)/i,
      /transfer (funds|money) to a (safe|secure|reserve) account/i,
      /processing (fee|deposit) of \$?[\d,]+/i,
    ],
    mechanism:
      'Guides the victim toward irreversible, untraceable payment rails before they realize they are dealing with an imposter.',
    desiredAction:
      'Liquidate funds and purchase non-refundable gift cards, crypto, or direct wire transfers.',
    saferAction:
      'No legitimate government agency or legitimate company will ever demand payment via gift cards or cryptocurrency.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /gift card|bitcoin|crypto|safe account/i.test(m))) {
        return { strength: 'High', reason: 'Demand for irreversible payment instruments (gift cards/cryptocurrency/safe accounts).' };
      }
      return { strength: 'Moderate', reason: 'Unusual fee or unexpected payment instruction.' };
    },
  },
  {
    category: 'CREDENTIAL_HARVESTING',
    name: 'Credential & Identity Harvesting',
    keywords: [
      'otp',
      'one time password',
      'pin',
      'password',
      'verification code',
      'security code',
      'ssn',
      'social security',
      'aadhaar',
      'pan card',
      'cvv',
      'card details',
      'enter your credentials',
      'update your password',
      'confirm your identity',
    ],
    patterns: [
      /share (the|your) (otp|code|pin|password)/i,
      /enter your (credentials|banking password|pin)/i,
      /verify your (card number|cvv|account details)/i,
      /send me the 6-digit (code|sms)/i,
    ],
    mechanism:
      'Convinces the victim that handing over secret 2FA credentials or passwords is a routine verification or security step.',
    desiredAction:
      'Disclose single-use OTPs or passwords that allow the attacker to take over bank accounts or digital profiles.',
    saferAction:
      'Never share OTPs or verification codes with anyone over call, SMS, or email. Banks explicitly state they will NEVER ask for your OTP.',
    strengthCriteria: (matches) => {
      if (matches.some((m) => /otp|one time password|pin|password|cvv/i.test(m))) {
        return { strength: 'High', reason: 'Direct attempt to capture secrets (OTP, PIN, password, CVV).' };
      }
      return { strength: 'Moderate', reason: 'Request for secondary identity verification markers.' };
    },
  },
];

export function analyzePsychologicalTactics(text: string): PsychologicalTactic[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const detected: PsychologicalTactic[] = [];
  const lowerText = text.toLowerCase();

  for (const def of TACTIC_DEFINITIONS) {
    const matchedClues: string[] = [];

    // Check keyword presence
    for (const kw of def.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        matchedClues.push(kw);
      }
    }

    // Check regex patterns
    for (const pattern of def.patterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        matchedClues.push(match[0]);
      }
    }

    if (matchedClues.length > 0) {
      // Deduplicate matched clues
      const uniqueClues = Array.from(new Set(matchedClues));
      const { strength, reason } = def.strengthCriteria(uniqueClues);

      // Extract brief excerpt showing evidence
      const evidenceSnippet = uniqueClues.slice(0, 3).map((c) => `"${c}"`).join(', ');

      detected.push({
        tactic: def.category,
        name: def.name,
        strength,
        strengthReason: reason,
        evidence: `Detected language indicators: ${evidenceSnippet}`,
        psychologicalMechanism: def.mechanism,
        desiredRecipientAction: def.desiredAction,
        saferAction: def.saferAction,
      });
    }
  }

  // Sort by High -> Moderate -> Low strength
  const strengthOrder: Record<string, number> = { High: 3, Moderate: 2, Low: 1 };
  return detected.sort((a, b) => strengthOrder[b.strength] - strengthOrder[a.strength]);
}
