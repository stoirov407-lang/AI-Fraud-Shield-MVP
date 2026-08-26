package com.fraudshield.security

enum class RiskLevel { SAFE, SUSPICIOUS, DANGEROUS }

data class RiskResult(
    val level: RiskLevel,
    val score: Int,
    val why: List<String>,
    val whatToDo: List<String>,
    val sources: List<String>
)
