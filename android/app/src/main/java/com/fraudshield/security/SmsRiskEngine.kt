package com.fraudshield.security

object SmsRiskEngine {
    private val url = Regex("https?://\\S+|www\\.\\S+", RegexOption.IGNORE_CASE)
    private val urgent = Regex("urgent|immediately|act now|expires|срочно|немедленно|истекает", RegexOption.IGNORE_CASE)
    private val otp = Regex("\\b(?:otp|one[- ]time|код|пароль|verification code)\\b", RegexOption.IGNORE_CASE)
    private val payment = Regex("pay|payment|transfer|bank|card|invoice|оплат|перевод|карта|банк", RegexOption.IGNORE_CASE)

    fun analyze(text: String): RiskResult {
        val reasons = mutableListOf<String>()
        var score = 0
        if (url.containsMatchIn(text)) { score += 35; reasons += "Contains a link" }
        if (urgent.containsMatchIn(text)) { score += 20; reasons += "Creates urgency" }
        if (otp.containsMatchIn(text)) { score += 25; reasons += "Requests or mentions a verification code" }
        if (payment.containsMatchIn(text)) { score += 15; reasons += "Involves payment or financial information" }
        val level = when {
            score >= 60 -> RiskLevel.DANGEROUS
            score >= 30 -> RiskLevel.SUSPICIOUS
            else -> RiskLevel.SAFE
        }
        val actions = when (level) {
            RiskLevel.DANGEROUS -> listOf("Don't open links", "Don't send money or verification codes", "Contact the organization through an official channel")
            RiskLevel.SUSPICIOUS -> listOf("Verify the sender", "Don't share sensitive information", "Check links before opening")
            RiskLevel.SAFE -> listOf("No suspicious signals were detected", "Still verify unexpected requests")
        }
        return RiskResult(level, score.coerceAtMost(100), reasons.ifEmpty { listOf("No suspicious signals detected") }, actions, listOf("Local security rules"))
    }
}
