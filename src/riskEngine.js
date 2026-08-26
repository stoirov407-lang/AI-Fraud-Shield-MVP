const RULES = [
  { re: /\b(urgent|immediately|act now|act fast|limited time|today only)\b/i, weight: 14, reason: 'Urgency or pressure language is being used.', type: 'Social engineering' },
  { re: /\b(pay|payment|fee|transfer|send money|send \$|wire|deposit|refund)\b/i, weight: 16, reason: 'The request involves money or payment.', type: 'Payment scam' },
  { re: /\b(password|passcode|otp|one[- ]time|verification code|security code|pin)\b/i, weight: 20, reason: 'It asks for sensitive authentication information.', type: 'Credential phishing' },
  { re: /\b(guaranteed|risk[- ]free|300%|500%|double your money|easy profit|get rich)\b/i, weight: 24, reason: 'It promises unusually high or guaranteed financial returns.', type: 'Investment scam' },
  { re: /\b(crypto|bitcoin|usdt|wallet|seed phrase|private key)\b/i, weight: 10, reason: 'Cryptocurrency or wallet language appears in the request.', type: 'Crypto scam' },
  { re: /\b(prize|winner|lottery|congratulations|you have won|free gift)\b/i, weight: 18, reason: 'Unexpected prize or reward language is present.', type: 'Prize scam' },
  { re: /\b(customs|delivery|package|parcel|courier|shipping)\b/i, weight: 10, reason: 'Delivery language is combined with a request or link.', type: 'Delivery phishing' },
  { re: /\b(bank|account|card|paypal|invoice)\b/i, weight: 8, reason: 'A financial account or payment service is referenced.', type: 'Impersonation' },
  { re: /https?:\/\//i, weight: 3, reason: 'The content contains a web link that should be verified before opening.', type: 'Suspicious link' },
  { re: /http:\/\//i, weight: 18, reason: 'The link uses unencrypted HTTP.', type: 'Insecure link' }
];

export function analyzeRisk(input) {
  const text = String(input || '').trim();
  let score = 4;
  const reasons = [];
  const types = new Set();

  for (const rule of RULES) {
    if (rule.re.test(text)) {
      score += rule.weight;
      reasons.push(rule.reason);
      types.add(rule.type);
    }
  }

  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[0]);
      const host = url.hostname.toLowerCase();
      if (url.username || url.password) {
        score += 25;
        reasons.push('The URL contains embedded credentials, a strong warning sign.');
        types.add('Credential phishing');
      }
      if (host.split('.').length > 4) {
        score += 8;
        reasons.push('The domain has an unusually deep subdomain structure.');
        types.add('Suspicious domain');
      }
      if (/\.(tk|ml|ga|cf|gq)$/i.test(host)) {
        score += 20;
        reasons.push('The domain uses a high-risk free top-level domain.');
        types.add('Suspicious domain');
      }
    } catch {
      score += 12;
      reasons.push('The URL could not be parsed normally.');
      types.add('Suspicious link');
    }
  }

  if (/\b(password|otp|passcode|pin|seed phrase|private key)\b/i.test(text) && /\b(pay|payment|fee|transfer|send money|deposit)\b/i.test(text)) {
    score += 12;
    reasons.push('It combines a payment request with sensitive credentials.');
    types.add('Credential/payment scam');
  }

  score = Math.min(99, score);
  const level = score >= 70 ? 'Dangerous' : score >= 35 ? 'Suspicious' : 'Safe';
  if (!reasons.length) reasons.push('No strong fraud signals were detected by this offline screening engine.');

  return {
    score,
    level,
    reasons: [...new Set(reasons)].slice(0, 6),
    attackType: types.size ? [...types][0] : 'No clear threat type',
    confidence: Math.min(98, Math.max(55, 58 + reasons.length * 7 + (level === 'Dangerous' ? 10 : 0)))
  };
}
