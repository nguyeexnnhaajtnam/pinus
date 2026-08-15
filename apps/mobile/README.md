# Pinus mobile

Flutter client using Riverpod, GoRouter, Dio, and secure platform token storage.

## Local setup

Create a local build configuration from the appropriate committed example:

```shell
cp apps/mobile/config/development.ios.example.json \
  apps/mobile/config/development.ios.local.json
```

Replace `GOOGLE_SERVER_CLIENT_ID` with the Web OAuth client ID also configured in backend `GOOGLE_AUTH_AUDIENCES`. Then run from the repository root:

```shell
make mobile-ios
```

For Android, copy `development.android.example.json` to `development.android.local.json` and run `make mobile-android`. Override device selection when needed, for example `make mobile-ios IOS_DEVICE="iPhone 17"`. Local JSON configuration files are ignored by Git.

Use `http://localhost:3000` for an iOS simulator and `http://10.0.2.2:3000` for the Android emulator. Tokens are stored as one versioned value through `SecureTokenStorage`, backed by Keychain on iOS and secure encrypted platform storage on Android. They are never stored in preferences or logged.

The authenticated Dio client attaches access tokens only to protected endpoints. Concurrent 401 responses share one refresh operation, persist the rotated pair before retry, and retry each request once. Permanent refresh rejection clears local authentication; transient network failure preserves the stored pair.

## Social-login setup

- Google: register the existing Android package `com.pinus.pinus_mobile` and iOS bundle `com.pinus.pinusMobile` in the provider console. Pass the Web OAuth client ID as `GOOGLE_SERVER_CLIENT_ID`; the backend must list that same value in `GOOGLE_AUTH_AUDIENCES`. Keep downloaded platform configuration and provider credentials out of Git.
- Apple: enable Sign in with Apple for `com.pinus.pinusMobile`. The repository includes the non-secret entitlement. Set `ENABLE_APPLE_SIGN_IN=true` for an Apple-capable build and include the bundle/service identifier in backend `APPLE_AUTH_AUDIENCES`.
- Apple login is intentionally iOS-only in this change. Provider availability is checked at runtime, so unsupported simulators/devices hide that action without blocking Google.
- Google/Apple identity tokens and the Apple raw nonce live only for the login exchange. The app stores only the returned Pinus access/refresh tokens in secure storage.

Use a physical device when a simulator lacks provider account/keychain support. Cancellation returns to idle without an error. A provider or backend failure keeps any existing Pinus credentials and displays a sanitized retryable message.
