# Fraud Shield Android — Phase 1

This folder defines the Android companion architecture for automatic protection.

## MVP flow

1. User signs in to the same Fraud Shield account.
2. User enables Protection.
3. The app receives supported SMS/notification events using Android's permitted APIs and user-granted permissions.
4. Content is passed through the on-device risk engine first.
5. The app shows Safe / Suspicious / Dangerous with Why, What to do, and Sources.
6. Results can later sync to the web dashboard.

## Important platform constraint

Android does not allow a normal website to silently read all SMS, messages, photos, videos, or files. Automatic monitoring must be implemented by a native Android app and must respect Android permissions, Google Play policies, and the user's explicit consent.

The first implementation target is SMS plus supported notification events. File/photo/video scanning will be added as explicit user-initiated or share-to-Fraud-Shield flows before attempting broader automation.

## Suggested modules

- `core/risk`: shared offline risk rules
- `sms`: incoming SMS receiver/service using allowed Android APIs
- `notifications`: notification listener, only with explicit user permission
- `ui`: protection status and threat notification UI
- `sync`: authenticated event sync to the web dashboard

## Threat result contract

```json
{
  "status": "SAFE | SUSPICIOUS | DANGEROUS",
  "score": 0,
  "type": "phishing",
  "why": [],
  "whatToDo": "",
  "sources": []
}
```

No cloud AI is required for this first MVP phase.