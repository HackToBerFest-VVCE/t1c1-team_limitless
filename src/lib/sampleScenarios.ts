import { AnalysisResult } from '../types';

export interface SampleScenario {
  id: string;
  title: string;
  category: 'Banking' | 'Delivery' | 'Reward' | 'Legitimate';
  type: 'message' | 'email' | 'url';
  snippet: string;
  fullContent: string;
  expectedVerdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  analysis: AnalysisResult;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'bank-kyc-scam',
    title: 'Urgent Bank KYC Suspension Alert',
    category: 'Banking',
    type: 'message',
    snippet: 'URGENT: Your SBI account has been suspended due to pending KYC update. Click http://sbi-kyc-verify24.com...',
    fullContent:
      'URGENT: Your SBI bank account will be blocked within 24 hours due to incomplete KYC update. Please update your PAN & Aadhaar immediately at http://sbi-kyc-verify24.com/update to avoid account deactivation and penalty.',
    expectedVerdict: 'SCAM',
    analysis: {
      id: 'sample-res-1',
      status: 'demo',
      verdict: 'SCAM',
      riskLevel: 'CRITICAL',
      riskScore: 94,
      summary:
        'High-confidence phishing attempt impersonating State Bank of India with fabricated urgency and an unverified domain designed to harvest banking and KYC credentials.',
      evidence: [
        'Domain "sbi-kyc-verify24.com" is NOT an official SBI portal (official is onlinesbi.sbi).',
        'Artificial deadline ("within 24 hours") creates panic to prevent verification.',
        'Threatens account blockage and financial penalties to induce compliance.',
        'Demands immediate disclosure of PAN and Aadhaar identity records.'
      ],
      suspiciousIndicators: [
        'Impersonation of major banking entity',
        'Lookalike domain name with arbitrary numbers',
        'Urgent ultimatum ("within 24 hours")',
        'Credential harvesting of national identity numbers'
      ],
      checksPerformed: [
        'URL syntax and brand domain validation',
        'Urgency and threat tone detection',
        'Banking credential request detection',
        'Heuristic psychological manipulation scoring'
      ],
      manipulationTactics: [
        {
          tactic: 'FEAR',
          name: 'Fear & Threat Induction',
          strength: 'High',
          strengthReason: 'Explicit threat of immediate account blockage and punitive penalties.',
          evidence: 'Detected: "account will be blocked", "penalty"',
          psychologicalMechanism:
            'Induces acute anxiety regarding loss of access to savings, provoking an impulsive panic response.',
          desiredRecipientAction:
            'Click the link and submit identity records without calling the local bank branch.',
          saferAction:
            'Never click links in SMS. Check your official mobile banking app or call your branch directly.'
        },
        {
          tactic: 'URGENCY',
          name: 'Artificial Urgency & Time Compression',
          strength: 'High',
          strengthReason: 'Severe 24-hour deadline designed to bypass analytical reflection.',
          evidence: 'Detected: "URGENT", "within 24 hours", "immediately"',
          psychologicalMechanism:
            'Reduces cognitive processing time so the victim does not notice the counterfeit URL.',
          desiredRecipientAction:
            'Rush to complete the fake form before consulting knowledgeable friends or bank staff.',
          saferAction:
            'Banks provide months of formal postal and in-app notices for KYC, never 24-hour SMS ultimatums.'
        },
        {
          tactic: 'TRUST_IMPERSONATION',
          name: 'Trust Impersonation & Identity Hijacking',
          strength: 'High',
          strengthReason: 'Direct imitation of national banking brand (SBI).',
          evidence: 'Detected: "Your SBI bank account"',
          psychologicalMechanism:
            'Hijacks the recipient\'s existing trust in their primary financial provider.',
          desiredRecipientAction: 'Treat the SMS as an authentic institutional notice.',
          saferAction: 'Verify the true sender ID. Banks use certified alphanumeric headers (e.g., VM-SBIINB).'
        },
        {
          tactic: 'CREDENTIAL_HARVESTING',
          name: 'Credential & Identity Harvesting',
          strength: 'High',
          strengthReason: 'Demands PAN, Aadhaar, and verification credentials via third-party link.',
          evidence: 'Detected: "update your PAN & Aadhaar", "update to avoid account deactivation"',
          psychologicalMechanism:
            'Normalizes the surrender of highly confidential identity documents as a routine bureaucratic requirement.',
          desiredRecipientAction: 'Enter government ID numbers and OTPs into the attacker\'s database.',
          saferAction: 'Never enter identity or banking credentials on any website opened from an SMS.'
        }
      ],
      recommendedActions: [
        'Do not click the link or reply to the sender.',
        'Delete the message and block the sender number.',
        'Report the SMS to your national cybercrime portal (e.g., cybercrime.gov.in in India).',
        'If you already entered information, contact your bank immediately to freeze online banking.'
      ],
      limitations: 'Heuristic pattern evaluation based on submitted text. Sender telephone header could not be verified.',
      language: 'en',
      analysisMode: 'message',
      timestamp: new Date().toISOString(),
      isDemo: true,
      disclaimer: 'DEMO RESULT — NOT A LIVE SECURITY CHECK.'
    }
  },
  {
    id: 'package-delivery-fee',
    title: 'Held Package Delivery Fee Scam',
    category: 'Delivery',
    type: 'message',
    snippet: 'FedEx Alert: We could not deliver your parcel due to missing apartment number. Pay $2.85 re-delivery fee at...',
    fullContent:
      'FedEx Express: Your parcel #FX-889104 is on hold at our distribution facility due to an incomplete delivery address. Please verify your address and pay the $2.85 rescheduling fee at https://fedx-parcel-tracking.click/redelivery before 6 PM today or it will be returned to sender.',
    expectedVerdict: 'SCAM',
    analysis: {
      id: 'sample-res-2',
      status: 'demo',
      verdict: 'SCAM',
      riskLevel: 'HIGH',
      riskScore: 88,
      summary:
        'Smishing attack leveraging courier impersonation (FedEx) and a low-dollar "nuisance fee" designed to harvest credit card numbers and CVV codes.',
      evidence: [
        'Lookalike domain "fedx-parcel-tracking.click" (misspelled FedEx, unusual .click TLD).',
        'Demands small payment ($2.85) to lower suspicion and prompt credit card entry.',
        'Imposes an arbitrary end-of-day deadline ("before 6 PM today").'
      ],
      suspiciousIndicators: [
        'Typosquatting courier domain',
        'Low fee micro-charge baiting credit card input',
        'Artificial return-to-sender deadline'
      ],
      checksPerformed: [
        'Domain legitimacy inspection',
        'Payment diversion flag check',
        'Urgency framing analysis'
      ],
      manipulationTactics: [
        {
          tactic: 'TRUST_IMPERSONATION',
          name: 'Trust Impersonation & Identity Hijacking',
          strength: 'High',
          strengthReason: 'Impersonating FedEx Express parcel delivery service.',
          evidence: 'Detected: "FedEx Express", "parcel #FX-889104"',
          psychologicalMechanism:
            'Capitalizes on the common expectation of e-commerce packages, triggering curiosity and concern over a missed delivery.',
          desiredRecipientAction: 'Click the tracking link without verifying the true courier URL.',
          saferAction: 'Track parcels only using the original merchant order tracking or the official fedex.com website.'
        },
        {
          tactic: 'FINANCIAL_PRESSURE',
          name: 'Unusual Financial Coercion',
          strength: 'Moderate',
          strengthReason: 'Demands an unexpected card payment for redelivery.',
          evidence: 'Detected: "pay the $2.85 rescheduling fee"',
          psychologicalMechanism:
            'The low amount ($2.85) seems trivial, so the target complies without realizing their full credit card details are being captured.',
          desiredRecipientAction: 'Type credit card number, expiration date, and CVV on the fake checkout page.',
          saferAction: 'Reputable shipping companies do not hold packages hostage for sub-$3 credit card fees via text.'
        },
        {
          tactic: 'URGENCY',
          name: 'Artificial Urgency & Time Compression',
          strength: 'Moderate',
          strengthReason: 'Imposes a same-day 6 PM deadline to force immediate payment.',
          evidence: 'Detected: "before 6 PM today or it will be returned"',
          psychologicalMechanism: 'Creates fear of losing the package or causing inconvenience to force quick action.',
          desiredRecipientAction: 'Submit card details hastily on mobile.',
          saferAction: 'Contact customer service using the official carrier app.'
        }
      ],
      recommendedActions: [
        'Do not open the link or provide credit card credentials.',
        'Mark message as spam and delete.',
        'If payment details were entered, immediately freeze or cancel the affected credit card.'
      ],
      limitations: 'Demonstration analysis of simulated delivery smishing scenario.',
      language: 'en',
      analysisMode: 'message',
      timestamp: new Date().toISOString(),
      isDemo: true,
      disclaimer: 'DEMO RESULT — NOT A LIVE SECURITY CHECK.'
    }
  },
  {
    id: 'crypto-prize-email',
    title: 'Unexpected Reward / Crypto Giveaway',
    category: 'Reward',
    type: 'email',
    snippet: 'Congratulations! You have been selected to receive 0.45 BTC ($28,000 USD) in the Binance Annual Community Grant...',
    fullContent:
      'Subject: Claim Approved: 0.45 BTC Credited to Your Wallet\n\nDear VIP Member,\nCongratulations! Your wallet address was randomly selected in the Binance Global Community Grant 2026. You have won 0.45 BTC (approx $28,450 USD).\nTo release your payout, connect your MetaMask or TrustWallet at https://binance-claim-airdrop.xyz/connect and enter your 12-word seed phrase to authorize gas fee transfer.\nAct within 3 hours or rewards roll over to the next candidate.',
    expectedVerdict: 'SCAM',
    analysis: {
      id: 'sample-res-3',
      status: 'demo',
      verdict: 'SCAM',
      riskLevel: 'CRITICAL',
      riskScore: 98,
      summary:
        'Classic cryptocurrency seed phrase drainer. Exploits greed with an unexpected windfall to trick the victim into disclosing their 12-word recovery seed phrase.',
      evidence: [
        'Requests the 12-word recovery seed phrase (instant total wallet liquidation).',
        'Offers unsolicited windfall of $28,450 without any prior contest entry.',
        'Counterfeit domain "binance-claim-airdrop.xyz" using untrusted .xyz extension.',
        'Extremely short 3-hour expiry window.'
      ],
      suspiciousIndicators: [
        'Seed phrase / private key theft',
        'Counterfeit cryptocurrency exchange domain',
        'Unrealistic lottery reward bait',
        'Extreme 3-hour countdown pressure'
      ],
      checksPerformed: [
        'Cryptocurrency wallet theft indicator check',
        'Domain registry structure check',
        'Dopamine exploitation reward analysis'
      ],
      manipulationTactics: [
        {
          tactic: 'REWARD_BAIT',
          name: 'Reward Bait & Greed/Dopamine Exploitation',
          strength: 'High',
          strengthReason: 'Promises $28,450 USD in cryptocurrency for zero consideration.',
          evidence: 'Detected: "Congratulations!", "randomly selected", "won 0.45 BTC ($28,450 USD)"',
          psychologicalMechanism:
            'Generates an intense dopamine reward surge that overrides skeptical reasoning and security habits.',
          desiredRecipientAction: 'Overlook the absurdity of the prize and eagerly proceed to claim funds.',
          saferAction: 'Remember: Real cryptocurrency exchanges NEVER distribute free Bitcoins to random users via email.'
        },
        {
          tactic: 'CREDENTIAL_HARVESTING',
          name: 'Credential & Identity Harvesting',
          strength: 'High',
          strengthReason: 'Explicitly requests the 12-word secret wallet recovery seed phrase.',
          evidence: 'Detected: "enter your 12-word seed phrase to authorize"',
          psychologicalMechanism:
            'Falsely frames the recovery phrase as a simple "authorization password" required for gas fees.',
          desiredRecipientAction: 'Type the 12 words into the fake site, allowing attackers to sweep all crypto tokens.',
          saferAction:
            'NEVER share your 12/24-word seed phrase with ANY site or person. Anyone with your seed phrase owns your assets.'
        },
        {
          tactic: 'URGENCY',
          name: 'Artificial Urgency & Time Compression',
          strength: 'High',
          strengthReason: '3-hour rollover deadline creates FOMO (fear of missing out).',
          evidence: 'Detected: "Act within 3 hours or rewards roll over"',
          psychologicalMechanism: 'Forces immediate action before the victim can consult a crypto forum or friend.',
          desiredRecipientAction: 'Connect wallet immediately in a state of excitement and FOMO.',
          saferAction: 'Ignore all unverified time-limited crypto giveaways.'
        }
      ],
      recommendedActions: [
        'Never enter your seed phrase anywhere online.',
        'Flag email as phishing and delete immediately.',
        'If seed phrase was shared, immediately create a brand new clean wallet on an uncompromised device.'
      ],
      limitations: 'Simulated demonstration of seed phrase phishing email.',
      language: 'en',
      analysisMode: 'email',
      timestamp: new Date().toISOString(),
      isDemo: true,
      disclaimer: 'DEMO RESULT — NOT A LIVE SECURITY CHECK.'
    }
  },
  {
    id: 'legitimate-github-notification',
    title: 'Legitimate Service Notification (Control)',
    category: 'Legitimate',
    type: 'email',
    snippet: 'GitHub: A new personal access token was generated for your account. If this was you, no action is needed...',
    fullContent:
      'Subject: [GitHub] A personal access token was created\n\nHi Alex,\nA new personal access token (classic) was recently created for your account alex-dev on 26 Oct 2026.\nToken name: cli-tool-access\nScopes: repo, read:user\nIf you generated this token, you do not need to take any action.\nIf you did not generate this token, please visit your account settings at https://github.com/settings/tokens to revoke it immediately.',
    expectedVerdict: 'SAFE',
    analysis: {
      id: 'sample-res-4',
      status: 'demo',
      verdict: 'SAFE',
      riskLevel: 'LOW',
      riskScore: 8,
      summary:
        'Standard security notification from an authentic domain. Contains specific contextual metadata, asks for no credentials, and directs to official settings.',
      evidence: [
        'Direct link to official "github.com" settings domain.',
        'No artificial urgency, no emotional coercion, and no threat of account deletion.',
        'Explicitly informs user that NO action is needed if they initiated the token.',
        'Does not ask for passwords, tokens, OTPs, or financial transactions.'
      ],
      suspiciousIndicators: [],
      checksPerformed: [
        'Domain authenticity verification (github.com)',
        'Absence of coercive psychological markers',
        'Credential harvesting check (clean)'
      ],
      manipulationTactics: [],
      recommendedActions: [
        'Confirm if you generated this token during local development.',
        'If you did not generate it, navigate to github.com directly and revoke the token.',
        'Keep two-factor authentication enabled on your account.'
      ],
      limitations: 'Assumes email originated from official GitHub SPF/DKIM authenticated mail servers.',
      language: 'en',
      analysisMode: 'email',
      timestamp: new Date().toISOString(),
      isDemo: true,
      disclaimer: 'DEMO RESULT — NOT A LIVE SECURITY CHECK.'
    }
  }
];
