# Fraud Shield Android — Protection Client

## Phase 1 goal

Keep protection enabled and automatically analyze supported incoming SMS and notification events. The web app remains the account/history dashboard.

## User flow

1. Sign in to the same Fraud Shield account.
2. Turn **Protection ON**.
3. Request only the Android permissions required for the enabled feature.
4. Receive a supported incoming SMS through Android's permitted APIs.
5. Inspect supported notification text through `NotificationListenerService` only after explicit user approval.
6. Run the on-device risk engine.
7. Show `SAFE`, `SUSPICIOUS`, or `DANGEROUS` with `Why`, `What to do`, and `Sources`.
8. Store results locally first; authenticated sync to the web dashboard comes after the local flow is stable.

## Platform constraints

A website cannot read SMS or inspect arbitrary app content. Native Android capabilities are required. Notification access is user-controlled. SMS access is sensitive and must comply with current Android and Google Play requirements. The app must never silently delete, alter, or send messages.

Do not promise universal inspection of every app, file, photo, video, or message. Android sandboxing prevents that. Those inputs should initially use explicit Share/Open-with-Fraud-Shield flows.

## Privacy-first architecture

Default to on-device analysis. Message contents must not be uploaded to a cloud service unless the user explicitly enables a cloud feature and the UI clearly explains what is sent and why.

## Result contract

```text
status: SAFE | SUSPICIOUS | DANGEROUS
score: 0..100
type: string
why: string[]
whatToDo: string
sources: string[]
createdAt: ISO-8601
```

## Implementation target

Create a Gradle Android application in Kotlin with:

- Protection screen and ON/OFF state
- local RiskEngine
- incoming SMS receiver using permitted Android APIs
- notification listener service with explicit user approval
- local threat-result storage
- clear threat notifications
- later authenticated sync to the existing web dashboard

No paid cloud AI API is required for Phase 1.