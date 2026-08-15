## Why

The authentication foundation can issue and manage Pinus sessions but users still have no supported way to prove their identity and start a session. Adding backend-verified Google and Apple sign-in completes the first usable authentication path for Phase 2 while preserving provider-neutral identity and session security.

## What Changes

- Add Google and Apple identity-token verification on the NestJS backend, including issuer, audience, signature, lifetime, and provider-specific claim validation.
- Add social-authentication endpoints that accept only provider identity tokens, resolve identity by provider plus provider subject, and never trust client-supplied User, email, or subject values.
- Create a User and Account atomically for a first verified provider identity; reuse the existing User and Account for subsequent sign-ins; do not merge identities by email.
- Handle optional provider email, duplicate identity attempts, and concurrent first-login requests without creating duplicate Users or Accounts.
- Use the existing trusted authentication boundary to create a Session and return Pinus access and refresh tokens with the approved lifecycle and session limit.
- Apply the existing authentication endpoint IP rate limit, sanitized failures, provider-token redaction, and Swagger documentation to social login.
- Add Google Sign-In and Sign in with Apple flows to Flutter, send only provider identity tokens to the Pinus backend, and store the returned Pinus token pair using the existing secure storage and authentication state.
- Add login loading, error, cancellation, and platform/provider-unavailable behavior without adding email/password, account linking, profile, couple, device-management, or account-deletion features.
- Add backend provider-verification, identity-resolution, duplicate/concurrency, invalid-token, provider-failure, API integration, and Flutter login-flow tests.

## Capabilities

### New Capabilities

- `social-authentication`: Backend verification and exchange of Google and Apple identity tokens for Pinus sessions.
- `mobile-social-login`: Flutter Google/Apple provider initiation, backend exchange, state transitions, cancellation, and availability behavior.

### Modified Capabilities

- `identity-session-domain`: Define atomic first-login identity creation and deterministic reuse of an existing provider-scoped Account without email-based merging.

## Impact

- Affects the NestJS authentication module, provider-verification adapters, environment validation, public authentication API, rate limiting, Swagger, logging redaction, and PostgreSQL integration tests.
- Affects Flutter authentication presentation/application layers, platform configuration, provider SDK integrations, secure-token persistence handoff, and mobile tests.
- Adds Google and Apple authentication SDK/verifier dependencies and local provider configuration placeholders; major or high-migration-cost dependency choices require owner approval before implementation.
- Requires provider application identifiers and platform entitlements for real-device testing, but commits no production provider secret and introduces no managed authentication service, Redis, recurring provider cost, or change to Pinus token/session behavior.
