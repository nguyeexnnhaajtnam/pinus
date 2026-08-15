## 1. Approval and Provider Configuration

- [x] 1.1 Obtain owner approval for the proposed Google/Apple backend verifier and Flutter provider SDK dependencies before installing any major or high-migration-cost package.
- [x] 1.2 Confirm local Google backend OAuth audience identifiers and Apple bundle/service audience identifiers without committing production credentials.
- [x] 1.3 Add placeholder-only Google and Apple audience configuration to backend environment examples and validation.
- [x] 1.4 Add mobile compile-time configuration validation for the provider identifiers required by each supported platform.
- [x] 1.5 Configure required Android/iOS Google application metadata and Apple Sign in with Apple capability/entitlements using local placeholders or ignored files.
- [x] 1.6 Extend structured-log redaction for identity tokens, raw nonces, authorization codes, provider credentials, and verified provider payloads.

## 2. Backend Provider Verification Boundary

- [x] 2.1 Define immutable normalized provider identity, provider verification input, invalid-credential, and retryable-provider-failure contracts.
- [x] 2.2 Define separate Google and Apple verifier interfaces/adapters so provider SDK types do not enter identity persistence or Session services.
- [x] 2.3 Implement bounded in-memory trusted-key retrieval/caching with controlled refresh for unknown key identifiers and no provider-token persistence.
- [x] 2.4 Implement Google identity-token signature verification and enforce issuer, configured audience, subject, issued-at, expiry, and clock-tolerance rules.
- [x] 2.5 Normalize only verified Google provider subject and optional email, rejecting OAuth access tokens and malformed or untrusted claims.
- [x] 2.6 Implement Apple identity-token signature verification and enforce issuer, configured audience, subject, issued-at, expiry, and clock-tolerance rules.
- [x] 2.7 Validate Apple nonce binding by comparing the verified token nonce with the hash of the ephemeral raw nonce.
- [x] 2.8 Normalize only verified Apple provider subject and optional email without requiring email on subsequent authorization.
- [x] 2.9 Map invalid tokens and temporary provider/JWK failures to stable provider-neutral sanitized errors with correct retryability.

## 3. Identity Resolution and Session Exchange

- [x] 3.1 Implement Account lookup exclusively by normalized provider and verified provider subject without querying by email.
- [x] 3.2 Implement serializable first-login creation of exactly one User and linked Account with optional informational email.
- [x] 3.3 Reconcile unique/serialization conflicts by reloading the winning Account while rolling back losing User creation.
- [x] 3.4 Ensure a known verified identity reuses its existing Account and User without automatically changing email or linking another Account.
- [x] 3.5 Refactor the trusted authentication seam as needed to issue a Session for the resolved User without exposing a public identity-spoofing route.
- [x] 3.6 Exchange the resolved identity for the existing Pinus token-pair response using unchanged token lifetimes, rotation, reuse, and five-Session behavior.
- [x] 3.7 Verify Session issuance failure returns no partial Pinus credentials and leaves any committed identity reusable by a later valid login.

## 4. Social Authentication API

- [x] 4.1 Add strict Google social-login request DTO accepting only the identity token required for backend verification.
- [x] 4.2 Add strict Apple social-login request DTO accepting only the identity token and raw nonce required for backend verification.
- [x] 4.3 Add `POST /auth/social/google` and connect verification, identity resolution, Session issuance, and the existing token-pair response.
- [x] 4.4 Add `POST /auth/social/apple` and connect verification, nonce validation, identity resolution, Session issuance, and the existing token-pair response.
- [x] 4.5 Apply the existing 10 requests/minute/IP authentication limiter before provider verification on both endpoints.
- [x] 4.6 Ensure unsupported providers have no dispatch path and extra client-supplied User, subject, or email fields are rejected by validation.
- [x] 4.7 Add Swagger contracts for both operations, token-pair success, invalid credential, provider unavailable, validation failure, and HTTP 429 without real credential examples.
- [x] 4.8 Verify global errors and logs never disclose whether a provider identity, User, or Account exists or include provider credential material.

## 5. Backend Tests

- [x] 5.1 Add controlled-key Google verifier tests for valid tokens and invalid signature, issuer, audience, subject, issued-at, expiry, and malformed claims.
- [x] 5.2 Add controlled-key Apple verifier tests for valid tokens and invalid signature, issuer, audience, subject, issued-at, expiry, nonce, and malformed claims.
- [x] 5.3 Add provider-key cache tests for cache reuse, one controlled refresh on unknown key ID, bounded failure, and retryable unavailability mapping.
- [x] 5.4 Add tests proving provider tokens, raw nonces, credentials, subjects, emails, and verified payloads are absent from logs and persistent storage.
- [x] 5.5 Add PostgreSQL tests for new identity creation with email, without email, and with an email already used by another provider identity.
- [x] 5.6 Add tests proving known provider identity login reuses the existing Account/User and the same subject at different providers remains distinct.
- [x] 5.7 Add concurrent first-login tests proving one User and Account are created, no orphan User remains, and successful requests use that User.
- [x] 5.8 Add Google and Apple endpoint integration tests for successful exchange into the unchanged Pinus Session/token lifecycle.
- [x] 5.9 Add endpoint tests for invalid provider tokens, client identity-field injection, provider failures, unsupported paths, and sanitized responses.
- [x] 5.10 Add rate-limit tests proving the eleventh social request per minute/IP returns 429 before verifier invocation and performs no identity or Session mutation.
- [x] 5.11 Add failure tests proving Session issuance errors return no partial tokens and a subsequent valid attempt reuses the committed identity safely.

## 6. Flutter Provider and Backend Adapters

- [x] 6.1 Add the approved Google Sign-In and Sign in with Apple Flutter dependencies and required generated platform registration changes.
- [x] 6.2 Define provider-neutral mobile login result types for success, cancellation, unavailable, and sanitized failure.
- [x] 6.3 Implement a Google provider adapter that checks configuration/availability and returns only an ephemeral Google identity token.
- [x] 6.4 Implement an Apple provider adapter that checks availability, generates a cryptographically random raw nonce, supplies its hash to Apple, and returns ephemeral identity proof.
- [x] 6.5 Add a social-authentication API client with separate Google and Apple exchange methods and strict Pinus token-pair parsing.
- [x] 6.6 Ensure provider identity tokens and raw nonces are excluded from Dio logging, Riverpod state, preferences, analytics, and exception text.

## 7. Flutter Login State and Presentation

- [x] 7.1 Add a login coordinator/state model with idle, provider-specific loading, recoverable error, and provider availability data.
- [x] 7.2 Prevent duplicate login submission and allow only one active provider attempt at a time.
- [x] 7.3 Implement Google login orchestration from provider initiation through backend exchange and existing secure authentication-state persistence.
- [x] 7.4 Implement Apple login orchestration from nonce-bound provider initiation through backend exchange and existing secure authentication-state persistence.
- [x] 7.5 Handle user cancellation by returning to idle unauthenticated state without backend exchange or visible error.
- [x] 7.6 Handle provider/backend failures by preserving existing Pinus credentials, clearing loading, and exposing a sanitized recoverable error.
- [x] 7.7 Add a minimal login screen showing only configured/available Google and Apple actions with loading, disabled, cancellation, and error behavior.
- [x] 7.8 Update GoRouter authentication redirects so initialization is respected, unauthenticated users reach login, and authenticated users reach the existing app entry.
- [x] 7.9 Verify provider proof is released after every success, failure, and cancellation while stored Pinus credentials restore through the existing foundation.

## 8. Flutter Tests

- [x] 8.1 Add Google adapter tests for available, unavailable, success, cancellation, provider failure, missing identity token, and configuration errors.
- [x] 8.2 Add Apple adapter tests for available, unavailable, nonce generation/hash binding, success without email, cancellation, and provider failure.
- [x] 8.3 Add API-client tests proving each provider calls only its matching endpoint with allowed credential fields and parses the Pinus token pair.
- [x] 8.4 Add login coordinator tests for provider-specific loading, duplicate-tap suppression, one active attempt, and cancellation without exchange.
- [x] 8.5 Add successful Google/Apple login tests proving the Pinus token pair is securely persisted before authenticated state.
- [x] 8.6 Add failure tests proving provider/backend errors preserve existing Pinus credentials and expose no provider token or internal detail.
- [x] 8.7 Add availability and widget tests proving one unavailable provider does not block the other and actions reflect loading/error state.
- [x] 8.8 Add router tests for initialization, unauthenticated login routing, authenticated routing, and state restoration after restart.

## 9. Documentation and Final Verification

- [x] 9.1 Document local Google/Apple application setup, backend audiences, iOS entitlements, Android metadata, simulator/device limitations, and ignored credential files.
- [x] 9.2 Document the backend verification boundary, provider-key failure behavior, optional email handling, no-email-merge rule, and concurrent first-login lifecycle.
- [x] 9.3 Document social-login API testing with controlled test keys/fixtures and real-provider smoke testing without committing production credentials.
- [x] 9.4 Update CI to run provider verifier, PostgreSQL concurrency, social endpoint, Flutter login, and platform build checks without real provider secrets.
- [x] 9.5 Run backend formatting, linting, build, unit tests, PostgreSQL integration/concurrency tests, and strict environment validation.
- [x] 9.6 Run Flutter formatting, analysis, unit/widget tests, and supported Android/iOS build checks with non-secret test configuration.
- [x] 9.7 Audit the implementation against all delta specs and confirm no email/password, account linking/merging, profile, avatar, device-management UI, deletion, couple, Redis, managed-auth, production-secret, or additional-provider scope was added.
