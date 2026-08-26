const RULES = [
  { re: /\b(urgent|immediately|act now|act fast|limited time|today only|within \d+ (minutes?|hours?))\b/i, weight: 14, reason: 'Urgency or pressure language is being used.', type: 'Social engineering' },
  { re: /\b(pay|payment|fee|transfer|send money|send \$|wire|deposit|refund|customs fee)\b/i, weight: 16, reason: 'The request involves money or payment.', type: 'Payment scam' },
  { re: /\b(password|passcode|otp|one[- ]time|verification code|security code|pin|login)\b/i, weight: 20, reason: 'It asks for sensitive authentication information.', type: 'Credential phishing' },
  { re: /\b(guaranteed|risk[- ]free|300%|500%|double your money|easy profit|get rich|guaranteed return)\b/i, weight: 24, reason: 'It promises unusually high or guaranteed financial returns.', type: 'Investment scam' },
  { re: /\b(crypto|bitcoin|usdt|wallet|seed phrase|private key)\b/i, weight: 10, reason: 'Cryptocurrency or wallet language appears in the request.', type: 'Crypto scam' },
  { re: /\b(prize|winner|lottery|congratulations|you have won|free gift|claim your reward)\b/i, weight: 18, reason: 'Unexpected prize or reward language is present.', type: 'Prize scam' },
  { re: /\b(customs|delivery|package|parcel|courier|shipping)\b/i, weight: 10, reason: 'Delivery language is combined with a request or link.', type: 'Delivery phishing' },
  { re: /\b(bank|account|card|paypal|invoice|tax authority)\b/i, weight: 8, reason: 'A financial account or payment service is referenced.', type: 'Impersonation' },
  { re: /https?:\/\//i, weight: 3, reason: 'The content contains a web link that should be verified before opening.', type: 'Suspicious link' },
  { re: /http:\/\//i, weight: 18, reason: 'The link uses unencrypted HTTP.', type: 'Insecure link' },
  { re: /\b(?:send|pay|transfer).{0,80}\b(?:gift ?card|crypto|bitcoin|usdt)\b/i, weight: 18, reason: 'Payment is requested through a hard-to-reverse payment method.', type: 'Payment scam' }
];

const BENIGN_DOMAINS = new Set(['wikipedia.org', 'google.com', 'microsoft.com', 'apple.com', 'github.com']);

export function analyzeRisk(input) {
  const text = String(input || '').trim();
  let score = 4;
  const reasons = [];
  const types = new Set();
  let signalCount = 0;

  for (const rule of RULES) {
    if (rule.re.test(text)) {
      score += rule.weight;
      reasons.push(rule.reason);
      types.add(rule.type);
      signalCount += 1;
    }
  }

  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[0]);
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      if (BENIGN_DOMAINS.has(host)) score = Math.max(0, score - 3);
      if (url.username || url.password) {
        score += 25;
        reasons.push('The URL contains embedded credentials, a strong warning sign.');
        types.add('Credential phishing');
        signalCount += 1;
      }
      if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
        score += 15;
        reasons.push('The link points directly to an IP address instead of a normal domain.');
        types.add('Suspicious domain');
        signalCount += 1;
      }
      if (host.includes('xn--')) {
        score += 14;
        reasons.push('The domain uses punycode, which can be used in look-alike domains.');
        types.add('Look-alike domain');
        signalCount += 1;
      }
      if (host.split('.').length > 4) {
        score += 8;
        reasons.push('The domain has an unusually deep subdomain structure.');
        types.add('Suspicious domain');
        signalCount += 1;
      }
      if (/\.(tk|ml|ga|cf|gq)$/i.test(host)) {
        score += 20;
        reasons.push('The domain uses a high-risk free top-level domain.');
        types.add('Suspicious domain');
        signalCount += 1;
      }
      if (url.port && !['80', '443'].includes(url.port)) {
        score += 8;
        reasons.push('The link uses a non-standard web port.');
        types.add('Suspicious link');
        signalCount += 1;
      }
    } catch {
      score += 12;
      reasons.push('The URL could not be parsed normally.');
      types.add('Suspicious link');
      signalCount += 1;
    }
  }

  if (/\b(password|otp|passcode|pin|seed phrase|private key)\b/i.test(text) && /\b(pay|payment|fee|transfer|send money|deposit)\b/i.test(text)) {
    score += 12;
    reasons.push('It combines a payment request with sensitive credentials.');
    types.add('Credential/payment scam');
    signalCount += 1;
  }

  score = Math.min(99, Math.max(0, score));
  const level = score >= 70 ? 'Dangerous' : score >= 35 ? 'Suspicious' : 'Safe';
  if (!reasons.length) reasons.push('No strong fraud signals were detected by this offline screening engine.');

  return {
    score,
    level,
    reasons: [...new Set(reasons)].slice(0, 6),
    attackType: types.size ? [...types][0] : 'No clear threat type',
    confidence: Math.min(96, Math.max(52, 52 + signalCount * 8 + (level === 'Dangerous' ? 8 : 0))),
    engine: 'Offline heuristic v0.3'
  };
}
