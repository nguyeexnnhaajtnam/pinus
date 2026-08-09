# Pinus mobile

Flutter client using Riverpod, GoRouter, Dio, and secure platform token storage.

## Local setup

Run from `apps/mobile`:

```shell
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

Use `http://localhost:3000` for an iOS simulator. Tokens are stored as one versioned value through `SecureTokenStorage`, backed by Keychain on iOS and secure encrypted platform storage on Android. They are never stored in preferences or logged.

The authenticated Dio client attaches access tokens only to protected endpoints. Concurrent 401 responses share one refresh operation, persist the rotated pair before retry, and retry each request once. Permanent refresh rejection clears local authentication; transient network failure preserves the stored pair. This foundation intentionally contains no login or registration UI and no social-provider SDK.
