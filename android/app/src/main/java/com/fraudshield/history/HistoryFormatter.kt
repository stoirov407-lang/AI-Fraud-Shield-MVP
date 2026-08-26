package com.fraudshield.history

import com.fraudshield.security.RiskLevel
import org.json.JSONArray

/** Lightweight UI-facing history model. */
data class HistoryItem(
    val timestamp: Long,
    val level: RiskLevel,
    val score: Int,
    val preview: String,
    val why: List<String>,
    val whatToDo: List<String>,
    val sources: List<String>
)

object HistoryFormatter {
    fun read(json: JSONArray): List<HistoryItem> = buildList {
        for (i in 0 until json.length()) {
            val item = json.getJSONObject(i)
            add(
                HistoryItem(
                    timestamp = item.optLong("timestamp"),
                    level = runCatching { RiskLevel.valueOf(item.optString("level")) }.getOrDefault(RiskLevel.SAFE),
                    score = item.optInt("score"),
                    preview = item.optString("preview"),
                    why = item.optJSONArray("why").toStrings(),
                    whatToDo = item.optJSONArray("whatToDo").toStrings(),
                    sources = item.optJSONArray("sources").toStrings()
                )
            )
        }
    }

    private fun JSONArray?.toStrings(): List<String> = if (this == null) emptyList() else buildList {
        for (i in 0 until length()) add(optString(i))
    }
}
