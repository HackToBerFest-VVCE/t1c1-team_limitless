import { UrlInspectionResult } from '../types';

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'ow.ly',
  'buff.ly',
  'rb.gy',
  'cutt.ly',
  'shorte.st',
  'adf.ly',
]);

const TRUSTED_BRAND_KEYWORDS = [
  'paypal',
  'amazon',
  'apple',
  'google',
  'microsoft',
  'netflix',
  'chase',
  'bankofamerica',
  'wellsfargo',
  'sbi',
  'hdfc',
  'icici',
  'whatsapp',
  'instagram',
  'facebook',
  'fedex',
  'ups',
  'dhl',
  'usps',
  'indiapost',
];

const SUSPICIOUS_WORDS = [
  'verify',
  'verification',
  'secure',
  'login',
  'signin',
  'account-suspended',
  'update-kyc',
  'kyc-update',
  'claim',
  'reward',
  'prize',
  'wallet',
  'refund',
  'authenticate',
  'confirm-identity',
  'suspended',
  'urgent',
];

export function inspectUrl(rawInput: string): UrlInspectionResult {
  const trimmed = rawInput.trim();
  const checksSummary: string[] = [];
  const suspiciousFlags: string[] = [];

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    // If user forgot protocol, prepend https:// for parsing check
    normalized = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
    checksSummary.push('URL syntax validation: Valid URL format');
  } catch {
    return {
      url: rawInput,
      isValid: false,
      protocol: '',
      hostname: '',
      pathname: '',
      isIpHost: false,
      isLookalikeOrTyposquat: false,
      hasMisleadingSubdomain: false,
      isShortener: false,
      usesHttps: false,
      hasSuspiciousKeywords: false,
      suspiciousFlags: ['The provided text is not a syntactically valid web URL.'],
      checksSummary: ['URL syntax validation: FAILED (Malformatted URL)'],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const fullSearch = parsed.search.toLowerCase();

  // 1. Protocol check
  const usesHttps = protocol === 'https:';
  if (!usesHttps) {
    suspiciousFlags.push('Insecure connection (HTTP instead of HTTPS). Plaintext transfer is vulnerable to interception.');
    checksSummary.push('Transport security: HTTP (Insecure plaintext)');
  } else {
    checksSummary.push('Transport security: HTTPS (Transport encrypted; note that malicious sites also use HTTPS)');
  }

  // 2. IP Host check (e.g. 192.168.1.1, 45.33.32.156)
  const isIpV4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpHost = isIpV4 || hostname.startsWith('[') && hostname.endsWith(']');
  if (isIpHost) {
    suspiciousFlags.push(`Direct IP address hostname (${hostname}) used instead of a registered domain name.`);
    checksSummary.push('Hostname format: Raw numerical IP address detected');
  } else {
    checksSummary.push('Hostname format: Standard domain name structure');
  }

  // 3. Shortener check
  const isShortener = KNOWN_SHORTENERS.has(hostname) || hostname.endsWith('.link') || hostname.endsWith('.click');
  if (isShortener) {
    suspiciousFlags.push(`URL shortener / redirect service detected (${hostname}). It conceals the true final destination.`);
    checksSummary.push('Domain redirection: Shortener service hiding destination');
  } else {
    checksSummary.push('Domain redirection: Direct domain address');
  }

  // 4. Misleading subdomains / brand impersonation
  let hasMisleadingSubdomain = false;
  let isLookalikeOrTyposquat = false;

  const domainParts = hostname.split('.');
  const primaryDomain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : hostname;

  for (const brand of TRUSTED_BRAND_KEYWORDS) {
    // Check if brand is in subdomains but not in primary domain
    if (hostname.includes(brand) && !primaryDomain.startsWith(brand)) {
      hasMisleadingSubdomain = true;
      suspiciousFlags.push(
        `Brand keyword "${brand}" appears in a subdomain (${hostname}), but the real registered domain is "${primaryDomain}".`
      );
    }

    // Check for character substitution typosquatting in primary domain (e.g. paypa1, amzn-security)
    const typoVariants = [
      brand.replace('l', '1'),
      brand.replace('o', '0'),
      brand.replace('i', '1'),
      `${brand}-`,
      `-${brand}`,
    ];
    for (const variant of typoVariants) {
      if (variant !== brand && primaryDomain.includes(variant)) {
        isLookalikeOrTyposquat = true;
        suspiciousFlags.push(`Possible lookalike / typosquatting domain variant targeting "${brand}" detected in "${primaryDomain}".`);
      }
    }
  }

  // 5. Suspicious keywords in path and query
  let hasSuspiciousKeywords = false;
  const pathAndQuery = `${pathname} ${fullSearch}`;
  const matchedKeywords: string[] = [];
  for (const word of SUSPICIOUS_WORDS) {
    if (pathAndQuery.includes(word)) {
      matchedKeywords.push(word);
      hasSuspiciousKeywords = true;
    }
  }

  if (hasSuspiciousKeywords) {
    suspiciousFlags.push(
      `Suspicious action keywords found in URL path/parameters: ${matchedKeywords.slice(0, 4).join(', ')}.`
    );
  }

  // 6. Multiple subdomains / strange TLD
  if (domainParts.length > 4) {
    suspiciousFlags.push('Excessive subdomain nesting commonly associated with phishing kit landing pages.');
  }

  checksSummary.push(`Lookalike inspection: ${isLookalikeOrTyposquat || hasMisleadingSubdomain ? 'Suspicious brand patterns identified' : 'No obvious typosquatting detected'}`);
  checksSummary.push(`Credential bait check: ${hasSuspiciousKeywords ? 'Login/verification keywords present in path' : 'Clean path profile'}`);

  return {
    url: rawInput,
    isValid: true,
    protocol,
    hostname,
    pathname,
    isIpHost,
    isLookalikeOrTyposquat,
    hasMisleadingSubdomain,
    isShortener,
    usesHttps,
    hasSuspiciousKeywords,
    suspiciousFlags,
    checksSummary,
  };
}
