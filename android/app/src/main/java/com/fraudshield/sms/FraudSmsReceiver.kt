package com.fraudshield.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.fraudshield.core.RiskEngine

class FraudSmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        if (messages.isEmpty()) return

        val text = messages.joinToString(separator = "") { it.messageBody.orEmpty() }.trim()
        if (text.isBlank()) return

        val result = RiskEngine.analyze(text)
        ProtectionNotifier.show(context, result)
    }
}
