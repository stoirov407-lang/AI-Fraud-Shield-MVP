package com.fraudshield.security

class RiskEngine {
    private val urgent = listOf("urgent", "immediately", "act now", "срочно", "немедленно")
    private val credentials = listOf("otp", "verification code", "password", "код подтверждения", "пароль")
    private val payment = listOf("pay", "payment", "transfer", "bank", "оплат", "перевод", "банк")
    private val suspiciousUrl = Regex("https?://[^\\s]+", RegexOption.IGNORE_CASE)

    fun analyze(text: String): RiskResult {
        val value = text.trim()
        if (value.isEmpty()) return RiskResult(RiskLevel.SAFE, 0, listOf("No message content"), listOf("No action needed"), listOf("Local rules"))

        val normalized = value.lowercase()
        val reasons = mutableListOf<String>()
        var score = 0

        if (urgent.any(normalized::contains)) { score += 25; reasons += "Creates urgency" }
        if (credentials.any(normalized::contains)) { score += 35; reasons += "Requests credentials or a verification code" }
        if (payment.any(normalized::contains)) { score += 20; reasons += "Contains a payment or banking request" }
        if (suspiciousUrl.containsMatchIn(value)) { score += 20; reasons += "Contains a link that should be verified" }

        score = score.coerceIn(0, 100)
        val level = when {
            score >= 70 -> RiskLevel.DANGEROUS
            score >= 35 -> RiskLevel.SUSPICIOUS
            else -> RiskLevel.SAFE
        }

        val actions = when (level) {
            RiskLevel.SAFE -> listOf("No action needed")
            RiskLevel.SUSPICIOUS -> listOf("Verify the sender before replying or paying", "Do not share passwords or codes")
            RiskLevel.DANGEROUS -> listOf("Do not open links", "Do not send money or verification codes", "Contact the organization through an official channel")
        }

        return RiskResult(level, score, reasons.ifEmpty { listOf("No known fraud signals detected") }, actions, listOf("Local security rules"))
    }
}
