package com.fraudshield.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.fraudshield.core.RiskEngine

class FraudSmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        for (message in Telephony.Sms.Intents.getMessagesFromIntent(intent)) {
            val text = message.messageBody.orEmpty()
            if (text.isBlank()) continue

            val result = RiskEngine.analyze(text)
            ProtectionNotifier.show(context, result)
        }
    }
}
