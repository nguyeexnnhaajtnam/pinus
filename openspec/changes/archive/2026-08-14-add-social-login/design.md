## Context

See `proposal.md` for motivation and the delta specs for behavior contracts. The archived authentication-foundation change already provides provider-scoped `Account` identity, `User` and `Session` persistence, backend-issued Pinus access/refresh tokens, a trusted identity seam, secure Flutter token storage, authentication state, and authenticated networking. It deliberately exposes no login endpoint and currently requires an Account to exist before Session issuance.

Google and Apple are owner-approved providers. Provider application identifiers, Apple entitlements, Google OAuth client configuration, and real-device credentials are environment/platform inputs rather than repository secrets. Implementation needs provider-verification and mobile SDK dependencies; their exact packages and versions require owner approval before dependency installation if they are major or costly to migrate.

## Goals / Non-Goals

**Goals:**

- Verify Google and Apple identity proof exclusively on the backend and normalize only verified provider data into the existing trusted identity boundary.
- Make first social login safe under concurrency without orphan Users, duplicate Accounts, or email-based identity merging.
- Reuse the existing Pinus Session and token lifecycle without introducing a second authentication system.
- Give Flutter a testable provider abstraction and deterministic login state while keeping provider credentials transient.
- Support local automated verification with controlled keys/claims and real-device testing through documented provider configuration.

**Non-Goals:**

- Link two provider Accounts to one User, discover matching Accounts by email, or migrate identities between providers.
- Add email/password, account recovery, provider-token refresh, profile/avatar editing, device management, account deletion, or couple behavior.
- Persist provider access tokens, identity tokens, authorization codes, raw nonces, provider key sets, or full verified claims in the application database.
- Add a managed authentication broker, Redis, paid provider service, production credential provisioning, or web login flow.
- Redesign onboarding beyond the minimal login presentation and states required to exercise the approved providers.

## Decisions

### 1. Use separate explicit Google and Apple exchange endpoints

Expose `POST /auth/social/google` and `POST /auth/social/apple`. The Google request contains only `identityToken`; the Apple request contains `identityToken` and the raw nonce generated for that attempt. Separate DTOs make provider-specific inputs and Swagger contracts explicit and prevent a client-selected arbitrary provider string from reaching a generic verifier registry.

Both routes return the existing Pinus token-pair response and use provider-neutral sanitized error identifiers. A single `/auth/social` endpoint was considered, but it expands dispatch input, makes provider-specific validation less visible, and creates an easier path for adding an unapproved provider accidentally.

### 2. Hide provider verification behind a narrow backend contract

Each adapter implements a contract that accepts ephemeral credential material and returns an immutable normalized identity containing only `provider`, `providerSubject`, and optional verified `email`. The social-authentication application service accepts only this normalized result; controllers and identity persistence never decode tokens themselves.

The verifier result is the only value allowed to cross the trusted provider boundary. Client DTOs contain no User ID, provider subject, or email. Provider-specific failures map to invalid credential or retryable provider-unavailable outcomes without exposing claim or key details.

Alternatives considered: accepting client-decoded claims violates DEC-002; passing the whole provider payload deeper into the application increases accidental trust and logging exposure.

### 3. Verify Google identity tokens against configured backend audiences

The Google adapter verifies the JWT signature against Google's trusted rotating keys and enforces the approved Google issuer set, configured backend OAuth client audience allowlist, non-empty subject, issued-at time, expiry, and normal JWT clock tolerance. Email is read only from the verified payload and remains optional; email verification does not establish Pinus identity.

Flutter requests an ID token intended for the configured backend/server client ID. OAuth access tokens are not accepted by the exchange endpoint. The verifier uses cached remote keys with bounded refresh behavior supplied by an owner-approved standard library rather than implementing JWT/JWK cryptography manually.

### 4. Verify Apple identity tokens with nonce binding

Flutter generates a cryptographically random nonce per Apple attempt, sends its SHA-256 digest to Apple, retains the raw nonce only during the attempt, and sends the raw nonce with the returned identity token to Pinus. The Apple adapter verifies the signature using Apple's trusted rotating keys, exact issuer, configured bundle/service audience allowlist, non-empty subject, issued-at time, expiry, and the token nonce against the hash of the submitted raw nonce.

Apple may provide email only on the first authorization; absence is valid. Authorization codes and Apple refresh tokens are unnecessary for this identity-token exchange and are not persisted. Omitting nonce validation was considered but weakens replay binding between the initiated mobile flow and returned credential.

### 5. Cache provider signing keys in process without persisting credentials

Provider verifiers use bounded in-memory JWK caching and standard HTTP cache/refresh semantics. Unknown key IDs may trigger one controlled key refresh; arbitrary invalid requests cannot create unbounded fetch loops. Network/key-service failure maps to retryable service unavailable, while bad claims/signatures map to a non-retryable sanitized authentication failure.

No provider token or full verified claims are cached. Redis and database JWK storage are unnecessary for the current single-instance/local foundation. Future multi-instance deployment can maintain independent standards-compliant caches.

### 6. Resolve or create identity in a serializable transaction

After verification, normalize the provider to the fixed internal values `google` or `apple` and query Account only by `(provider, providerSubject)`. If found, return its existing User. If absent, a serializable transaction creates one User and one Account. Unique-conflict/serialization retry reloads the winning Account; the losing transaction rolls back its User creation so no orphan identity remains.

The transaction never queries by email. A new Google and Apple identity reporting the same email create distinct Users until a future owner-approved account-linking flow exists. Provider email is stored only when the Account is created and is not automatically used to update or merge a known identity.

Alternatives considered: Prisma upsert cannot atomically create a new related User without carefully handling the losing User; pre-creating User outside the transaction can orphan it; email lookup violates the approved identity model.

### 7. Issue Sessions only after verified identity resolution

The identity resolver returns the existing or newly created User/Account to the authentication foundation, which creates a Session and Pinus token pair using the existing 15-minute access, 30-day rotating refresh, five-active-Session, oldest-session replacement, hash-only storage, and reuse rules. Provider verification does not alter those policies.

Identity creation and Session creation remain separate transaction boundaries. If Session issuance fails, the verified User/Account may remain and a retry resolves the same identity; no Pinus or provider credential is partially returned. A distributed transaction provides no benefit and would couple stable identity persistence to token response delivery.

### 8. Apply rate limiting before expensive provider verification

Both social endpoints use the existing authentication IP limiter at 10 requests per minute per source IP before remote-key lookup or signature verification. Rate-limited requests perform no identity or Session mutation. The existing refresh Session limit does not apply because no Session exists before first login.

Provider-neutral endpoint metrics may record outcome class and provider name, but never tokens, subjects, email, nonces, or full claims. Structured logger redaction adds identity-token and nonce DTO paths.

### 9. Model Flutter providers behind independent adapters

Define a mobile provider interface returning one of success with ephemeral identity proof, user cancellation, unavailable, or sanitized failure. Google and Apple SDK adapters translate platform/plugin-specific results into this contract. The login coordinator owns backend exchange and authentication-state handoff, so presentation and tests do not depend directly on SDK types.

Google availability follows SDK/platform configuration. Apple availability is checked at runtime and the Apple action is shown only when supported and configured; an unavailable provider does not block the other provider. This avoids promising unsupported platform behavior while retaining both approved methods where available.

### 10. Extend authentication state with one active login attempt

The login coordinator permits one provider attempt at a time, records which provider is loading, and ignores duplicate taps for the active attempt. Cancellation returns to idle unauthenticated state without an error. Provider or backend failure yields a sanitized recoverable error and does not clear or overwrite an existing Pinus token pair.

On success, the coordinator passes the backend Pinus token pair to the existing authentication controller, which writes the pair atomically to secure storage before exposing authenticated state. Provider identity tokens and raw nonces remain local variables and are released in a `finally` path; they never enter Riverpod state, logs, preferences, or analytics.

### 11. Route unauthenticated users through a minimal login surface

The existing router observes authentication initialization and state. After initialization, unauthenticated users reach a minimal login screen with available Google/Apple actions and loading/error/cancel behavior; authenticated users continue to the existing application entry. This change does not introduce registration fields, profile capture, account linking, or onboarding content.

## Risks / Trade-offs

- [Provider SDK and verifier APIs change] → Isolate dependencies behind adapters, pin reviewed versions, and require approval before adding high-migration-cost packages.
- [Remote JWK service is unavailable] → Use bounded standards-compliant in-memory caching and distinguish retryable provider failure from invalid credentials.
- [Clock skew rejects otherwise valid tokens] → Use a small documented verifier tolerance without extending provider token lifetime or Pinus token lifetimes.
- [Apple supplies email only once] → Treat email as optional and never require it for lookup or subsequent login.
- [Same person uses Google and Apple before account linking exists] → Create separate Users as explicitly approved; document that merging is not automatic.
- [Concurrent first login creates transaction conflicts] → Use serializable retry plus the existing provider-subject unique constraint and deterministic integration tests.
- [A valid provider token can be submitted more than once during its short lifetime] → Each accepted login is treated as a new device Session under the existing five-Session policy; Apple nonce binds the credential to its initiated attempt, while broader replay policy would change authentication behavior and requires a future decision.
- [Provider availability differs by platform/configuration] → Query adapter availability and keep providers independently enabled rather than presenting a broken action.
- [Provider credential leakage through diagnostics] → Redact DTO paths and test logs/errors; retain only normalized identity fields after verification.

## Migration Plan

1. Obtain owner approval for the proposed backend verification and Flutter provider dependencies and confirm the Google/Apple application identifiers used for local testing.
2. Add placeholder-only backend audience configuration, mobile platform configuration, Apple entitlements, environment validation, and secret/token redaction.
3. Implement provider-verifier contracts and adapters with controlled-key unit tests before exposing endpoints.
4. Implement serializable resolve-or-create identity behavior and connect it to existing Session issuance with PostgreSQL concurrency tests.
5. Add social endpoints, rate limiting, Swagger, sanitized errors, and API integration tests.
6. Add Flutter provider adapters, availability checks, login coordinator/state, minimal login presentation, router integration, and fake-backed tests.
7. Run backend unit/integration tests and Flutter analysis/tests/builds; perform real-provider smoke tests only with locally supplied provider configuration.

Rollback removes the social endpoints, provider adapters, mobile login surface, platform configuration, and new dependencies. No schema migration is expected because the existing User/Account/Session model and unique constraint are reused. Verified identities already created remain valid data; deleting them would require separate destructive-data approval and is not part of rollback.
