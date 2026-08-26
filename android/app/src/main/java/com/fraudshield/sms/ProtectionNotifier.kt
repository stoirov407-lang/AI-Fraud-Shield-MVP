package com.fraudshield.sms

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import com.fraudshield.security.RiskLevel
import com.fraudshield.security.RiskResult

object ProtectionNotifier {
    private const val CHANNEL_ID = "fraud_shield_protection"

    fun show(context: Context, result: RiskResult) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_ID, "Fraud Shield Protection", NotificationManager.IMPORTANCE_HIGH)
        )

        val title = when (result.level) {
            RiskLevel.SAFE -> "🟢 SAFE"
            RiskLevel.SUSPICIOUS -> "🟡 SUSPICIOUS"
            RiskLevel.DANGEROUS -> "🔴 DANGEROUS"
        }
        val text = "Why: ${result.why.joinToString("; ")}\nWhat to do: ${result.whatToDo.joinToString("; ")}\nSources: ${result.sources.joinToString("; ")}"

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        manager.notify((System.currentTimeMillis() and 0x7FFFFFFF).toInt(), notification)
    }
}
