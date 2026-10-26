import { describe, it, expect } from 'vitest';
import { inspectUrl } from '../lib/urlAnalyzer';

describe('URL Analysis Engine', () => {
  it('detects typosquatting lookalike domains (e.g. paypa1)', () => {
    const res = inspectUrl('https://paypa1-security-verification.com/login');
    expect(res.isValid).toBe(true);
    expect(res.isLookalikeOrTyposquat).toBe(true);
    expect(res.suspiciousFlags.some((f) => f.includes('lookalike'))).toBe(true);
  });

  it('detects IP address as host', () => {
    const res = inspectUrl('http://192.168.1.150/account-blocked');
    expect(res.isValid).toBe(true);
    expect(res.isIpHost).toBe(true);
    expect(res.usesHttps).toBe(false);
    expect(res.suspiciousFlags.some((f) => f.includes('IP address'))).toBe(true);
  });

  it('identifies URL shorteners that obscure destinations', () => {
    const res = inspectUrl('https://bit.ly/3xY9Qz1');
    expect(res.isValid).toBe(true);
    expect(res.isShortener).toBe(true);
    expect(res.suspiciousFlags.some((f) => f.includes('shortener'))).toBe(true);
  });

  it('detects brand keyword in misleading subdomain', () => {
    const res = inspectUrl('https://amazon.com.order-tracking-update.xyz');
    expect(res.isValid).toBe(true);
    expect(res.hasMisleadingSubdomain).toBe(true);
  });

  it('passes a standard legitimate domain with clean path', () => {
    const res = inspectUrl('https://github.com/settings/tokens');
    expect(res.isValid).toBe(true);
    expect(res.isIpHost).toBe(false);
    expect(res.isShortener).toBe(false);
    expect(res.isLookalikeOrTyposquat).toBe(false);
    expect(res.usesHttps).toBe(true);
  });
});
