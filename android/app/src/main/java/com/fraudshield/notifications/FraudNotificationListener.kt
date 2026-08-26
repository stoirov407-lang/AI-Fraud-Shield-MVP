package com.fraudshield.notifications

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.fraudshield.core.RiskEngine
import com.fraudshield.sms.ProtectionNotifier

class FraudNotificationListener : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val extras = sbn.notification.extras
        val text = listOf(
            extras.getCharSequence("android.title"),
            extras.getCharSequence("android.text")
        ).filterNotNull().joinToString(" ")

        if (text.isBlank()) return
        val result = RiskEngine.analyze(text)
        if (result.score >= 30) ProtectionNotifier.show(this, result)
    }
}
