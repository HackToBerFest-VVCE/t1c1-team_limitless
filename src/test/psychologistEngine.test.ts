import { describe, it, expect } from 'vitest';
import { analyzePsychologicalTactics } from '../lib/psychologistEngine';

describe('Scam Psychologist Engine', () => {
  it('detects FEAR and URGENCY tactics from urgent suspension threats', () => {
    const text = 'URGENT: Your account will be suspended within 24 hours due to violation.';
    const tactics = analyzePsychologicalTactics(text);
    
    const categories = tactics.map((t) => t.tactic);
    expect(categories).toContain('URGENCY');
    expect(categories).toContain('FEAR');

    const urgency = tactics.find((t) => t.tactic === 'URGENCY');
    expect(urgency?.strength).toBe('High');
    expect(urgency?.saferAction).toBeDefined();
  });

  it('detects CREDENTIAL HARVESTING and TRUST IMPERSONATION', () => {
    const text = 'Dear Customer, your SBI bank fraud department requires your OTP and PIN to cancel payment.';
    const tactics = analyzePsychologicalTactics(text);

    const categories = tactics.map((t) => t.tactic);
    expect(categories).toContain('CREDENTIAL_HARVESTING');
    expect(categories).toContain('TRUST_IMPERSONATION');
  });

  it('detects REWARD BAIT from unexpected lottery prizes', () => {
    const text = 'Congratulations! You won a free iPhone and $10,000 cash prize in our lucky draw!';
    const tactics = analyzePsychologicalTactics(text);

    const categories = tactics.map((t) => t.tactic);
    expect(categories).toContain('REWARD_BAIT');
  });

  it('detects FINANCIAL PRESSURE from gift card payment requests', () => {
    const text = 'To clear the customs tax on your parcel, pay with a $100 Steam gift card immediately.';
    const tactics = analyzePsychologicalTactics(text);

    const categories = tactics.map((t) => t.tactic);
    expect(categories).toContain('FINANCIAL_PRESSURE');
  });

  it('returns empty tactics on ordinary benign message', () => {
    const text = 'Hey Alex, are we still meeting for lunch at 12:30 today? Let me know!';
    const tactics = analyzePsychologicalTactics(text);
    expect(tactics.length).toBe(0);
  });
});
