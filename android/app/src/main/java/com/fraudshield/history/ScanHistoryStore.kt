package com.fraudshield.history

import android.content.Context
import com.fraudshield.security.RiskResult
import org.json.JSONArray
import org.json.JSONObject

object ScanHistoryStore {
    private const val PREFS = "fraud_shield_history"
    private const val KEY = "scans"
    private const val MAX_ITEMS = 100

    fun add(context: Context, result: RiskResult, preview: String) {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val old = JSONArray(prefs.getString(KEY, "[]"))
        val next = JSONArray()
        next.put(JSONObject().apply {
            put("timestamp", System.currentTimeMillis())
            put("level", result.level.name)
            put("score", result.score)
            put("preview", preview.take(160))
            put("why", JSONArray(result.why))
            put("whatToDo", JSONArray(result.whatToDo))
            put("sources", JSONArray(result.sources))
        })
        for (i in 0 until minOf(old.length(), MAX_ITEMS - 1)) next.put(old.getJSONObject(i))
        prefs.edit().putString(KEY, next.toString()).apply()
    }

    fun getAll(context: Context): JSONArray =
        JSONArray(context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "[]"))
}
