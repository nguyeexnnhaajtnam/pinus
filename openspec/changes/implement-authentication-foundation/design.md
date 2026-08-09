## Context

See `proposal.md` for motivation and the three delta specs for behavior contracts. DEC-002 approves backend-issued tokens, a User/Account/Session identity direction, 15-minute access tokens, 30-day rotating refresh tokens, hash-only refresh storage, multiple device sessions, and a maximum of five active Sessions.

The current NestJS service has Prisma/PostgreSQL, validated environment configuration, global structured logging/error handling, Swagger, and a health module. The Flutter client has Riverpod, GoRouter, and a shared Dio foundation but no secure credential storage or authentication state. No provider is integrated in this change, so session creation must be an internal boundary callable only after a future provider module verifies provider evidence on the backend.

The owner has approved the remaining session and rate-limit policies: creating a sixth Session revokes the oldest active Session, valid rotated-token reuse revokes the affected device Session and requires authentication again, all authentication endpoints are limited to 10 requests per minute per IP, and refresh is additionally limited to 30 requests per minute per Session.

## Goals / Non-Goals

**Goals:**

- Create provider-neutral identity and session persistence that does not equate email with identity.
- Make refresh rotation correct under concurrency and make revocation immediately effective for protected API requests.
- Establish a backend-only identity-verification seam without adding a test or production login backdoor.
- Keep all token material out of database plaintext, logs, ordinary mobile preferences, and error responses.
- Give Flutter deterministic restoration, authenticated request, single-flight refresh, one-retry, and sign-out behavior.
- Provide test seams that exercise authorization, transaction races, reuse detection, and client concurrency without real provider credentials.

**Non-Goals:**

- Verify Google, Apple, email/password, or any other login credential.
- Expose a public endpoint that accepts a provider subject, email, or User ID as proof of identity.
- Add profile, avatar, account-linking UI, device-list UI, account deletion, password recovery, Redis, or production key management.
- Design browser token storage, cookies, web authentication, or offline-first authentication.
- Automatically purge historical revoked Sessions or define account-deletion retention behavior.

## Decisions

### 1. Use a minimal provider-neutral relational model

`User` is the Pinus identity and contains a stable generated ID plus audit timestamps. `Account` contains its own ID, `userId`, normalized `provider`, opaque `providerSubject`, nullable provider-reported email, and audit timestamps, with a unique constraint on `(provider, providerSubject)` and an index on `userId`. Email is informational and not unique identity evidence.

`Session` contains its own ID, `userId`, the current `refreshTokenHash`, integer `refreshTokenVersion`, absolute `expiresAt`, nullable `revokedAt`, `createdAt`, `updatedAt`, and `lastUsedAt`. It has indexes supporting active-session lookup and User revocation. No persistent hardware fingerprint or separate Device model is added because device identification remains an owner-approval topic; each successful trusted sign-in creates one independently revocable Session.

Alternatives considered: placing provider fields directly on User prevents multiple linked Accounts; making email unique risks incorrect account merges; adding a Device model or provider enum now makes unapproved product/provider assumptions.

### 2. Keep session creation behind a typed internal trusted-identity boundary

The authentication module exposes an internal application service that accepts a value produced by a backend provider verifier, not a public DTO. Future provider adapters will verify issuer, audience, signature, expiry, nonce, and provider subject, then call this seam. Tests use a test-only in-process provider/factory override rather than a route compiled into the application.

The service resolves Account by `(provider, providerSubject)`, creates or selects the linked User according to future approved account-linking rules, enforces the Session limit, and issues a token pair transactionally. This change does not implement new-User/provider-linking policy beyond persistence and rejects unverified client identity claims.

Alternatives considered: a development login endpoint creates an identity-spoofing surface; accepting client-decoded provider claims violates DEC-002; coupling session issuance directly to Google or Apple defeats the provider-neutral foundation.

### 3. Use separate signed JWT types with independent secrets

Access and refresh tokens use distinct validated signing secrets, issuer/audience configuration, and explicit token-type claims. Access JWTs contain `sub` (User ID), `sid` (Session ID), type, issued-at, and expiry and last 15 minutes. Refresh JWTs contain `sub`, `sid`, `ver` (rotation version), unique token ID, type, issued-at, and an expiry capped by the Session's fixed 30-day lifetime.

Using a signed refresh token makes stale rotation state cryptographically verifiable without storing plaintext or a history of token hashes. Independent secrets prevent a token or key intended for one purpose from being accepted for the other. Opaque refresh tokens were considered, but reliable family-reuse detection would require another token-history model or retaining multiple hashes, expanding the approved model direction.

### 4. Hash high-entropy refresh tokens with a one-way digest

The backend generates each signed refresh JWT with high entropy and stores a SHA-256 digest of its exact encoded value in `Session.refreshTokenHash`. A slow password hash is unnecessary for a high-entropy, signed, non-user-chosen token and would add cost to every refresh without improving resistance to guessing. Comparisons use constant-time semantics where application comparison is needed.

Only the response that creates or rotates a Session receives plaintext tokens. Logger redaction covers authorization headers, refresh DTO fields, token-pair fields, hashes, and signing configuration. Token values are never placed in exceptions or test snapshots.

Alternatives considered: plaintext enables immediate credential theft after database compromise; reversible encryption leaves a decryptable credential store; password hashing treats random tokens like low-entropy passwords.

### 5. Authorize access JWTs against live Session state

The authentication guard verifies JWT signature and standard claims, enforces access token type, then loads the referenced Session and confirms `session.userId === sub`, `revokedAt` is null, and `expiresAt` is in the future. It attaches an immutable `{ userId, sessionId }` current-user context derived only from verified data. Controllers use a decorator to read that context and never accept ownership from request parameters for current-user operations.

This database lookup makes sign-out and reuse revocation effective immediately. Stateless validation until access-token expiry was considered, but it weakens the approved session-revocation behavior for up to 15 minutes. Caching is deferred; Redis is excluded.

### 6. Rotate with compare-and-swap inside a transaction

`POST /auth/refresh` verifies the refresh signature/type/standard claims before using its User, Session, and version claims. For a current token, a transaction verifies active Session ownership, fixed Session expiry, current version, and stored hash, then conditionally updates the row from the expected version/hash to the next version/new hash. The update count must be exactly one before tokens are returned.

No transaction exposes two valid stored hashes. If two calls use the same token, at most one compare-and-swap succeeds. The losing request reloads state to distinguish a valid stale version from other rejection cases. Database serialization/conflict errors use bounded internal retries only around the transaction, never re-issue multiple token pairs.

Alternatives considered: read-then-write without a conditional predicate permits double rotation; a process mutex fails across processes; Redis locks are excluded and unnecessary for PostgreSQL-owned consistency.

### 7. Treat cryptographically valid stale refresh use as device-session compromise

If signature, issuer, audience, type, expiry, User, and Session claims are valid but `ver` is lower than the current Session version, the backend atomically sets `revokedAt` and rejects the request. All access and refresh credentials for that affected device Session then fail, and the device must authenticate again. A fabricated or unverifiable token never triggers revocation based on parsed claims alone.

This intentionally means two clients bypassing single-flight and racing the same refresh credential cause the losing valid replay to revoke the Session after at most one rotation succeeds; any successor issued by the winner is consequently invalid and the device must authenticate again. The Flutter single-flight design prevents that legitimate same-process race. Reuse-only rejection without revocation was considered but leaves a potentially stolen credential family active; revoking every User Session was considered disproportionate because compromise evidence is scoped to one Session.

### 8. Enforce the five-session limit by revoking the oldest active Session

Session creation excludes expired/revoked records and counts active Sessions. When five are active, the same transaction selects the oldest by `createdAt` with Session ID as a deterministic tie-breaker, revokes it, and creates the replacement Session. PostgreSQL serializable transaction semantics plus bounded conflict retry prevent concurrent sign-ins from exceeding five active Sessions or revoking an inconsistent candidate.

Rejecting the sixth Session was considered, but the owner selected deterministic oldest-active-Session replacement so a new trusted sign-in can proceed while the limit remains enforced.

### 9. Keep sign-out operations scoped and idempotent

`POST /auth/sign-out` uses current-user context and sets the current Session's `revokedAt` if not already set. `POST /auth/sign-out-others` updates active Sessions with the same User ID and a different Session ID in one transaction. Neither endpoint accepts a target User ID. The current-session call treats already-revoked state as successful for safe retries, while the guard ensures unauthenticated callers cannot invoke either route.

Individual arbitrary-session revocation and device listing are deferred to the later device-session-management change.

### 10. Rate limit without Redis behind a replaceable boundary

Authentication endpoints use a process-local NestJS-compatible limiter with sanitized HTTP 429 responses. Every authentication endpoint is limited to 10 requests per minute per source IP. Refresh is also limited to 30 requests per minute per cryptographically verified Session; it is rejected when either limit is exceeded. The IP check occurs without trusting token claims, while Session-scoped counting occurs only after token verification. Rate-limited requests must not mutate Session state.

These thresholds, one-minute windows, and IP/Session key scopes are owner-approved. The limiter is intentionally replaceable: a future multi-instance deployment must revisit distributed enforcement rather than assuming process-local counters are global. Redis and managed rate-limiting services remain out of scope.

### 11. Separate Flutter public and authenticated transports

Flutter uses a low-level Dio instance for refresh/session endpoints and a separate authenticated Dio instance with an interceptor for protected calls. This prevents the refresh request from recursively entering its own authorization interceptor. Public endpoints are allowlisted explicitly rather than inferred from missing state.

The interceptor reads a token snapshot from Riverpod authentication state, attaches the access token, and never logs authorization or refresh bodies. A response is eligible for refresh only for the configured authentication failure and only when it has not already been retried.

### 12. Store the token pair as one secure value

A `SecureTokenStorage` interface reads, writes, and deletes a versioned token-pair document. The production adapter uses Flutter Secure Storage backed by Keychain on iOS and encrypted platform storage on Android. Writing one serialized pair avoids exposing a half-updated access/refresh pair to application restore logic. Unit tests use an in-memory fake through the interface.

Ordinary preferences and a database are rejected for tokens. Platform accessibility/unlock options must use safe library defaults unless a different security/user-experience policy receives owner approval.

### 13. Coordinate refresh through one shared Future

The authentication coordinator owns a nullable in-flight refresh Future. The first eligible unauthorized response creates it; concurrent responses await it. Success writes the new pair to secure storage, updates in-memory state, then completes waiters. Each waiter clones and retries its original request once with an internal retry marker.

Permanent refresh rejection clears secure storage and moves state to unauthenticated before failing every waiter. Retryable network failures preserve the existing pair and surface a retryable failure; they do not automatically loop. Completion always clears the in-flight Future in a `finally` path.

Alternatives considered: refreshing independently creates server-side reuse revocations; retrying before persistence risks restoring an obsolete pair after restart; unlimited retries can create request loops.

### 14. Keep secrets and security assumptions explicit

Backend environment validation requires separate non-placeholder access and refresh signing secrets plus issuer/audience values. Local examples contain placeholders only. Swagger documents endpoint contracts and sanitized errors but never example tokens or secrets. Documentation explains how integration tests create trusted identities in-process, how Session states transition, what is and is not protected against, and why provider verification remains absent.

## Risks / Trade-offs

- [Every protected request queries Session state] → Index Session primary key/User ownership and measure before considering a cache; immediate revocation is the current priority.
- [JWT refresh tokens expose non-secret identifiers and version metadata] → Include no email/provider/private profile data, require TLS outside local development, and rely on signature plus hash comparison for trust.
- [Stale-token reuse can revoke a legitimate Session after an accidental duplicate refresh] → Enforce Flutter single-flight, make refresh retry behavior explicit, require authentication again on the affected device, and test the race deterministically.
- [Process-local rate limits differ across future API replicas] → Document the limitation and revisit the replaceable limiter when deployment topology is approved; do not add Redis preemptively.
- [Serializable Session-limit transactions can abort under contention] → Use a small bounded retry for serialization conflicts and integration-test concurrent creation at the boundary.
- [Secure storage behavior varies by mobile platform and device state] → Hide it behind an interface, use conservative defaults, and test read/write/delete/error behavior independently.
- [Signing-key rotation is not designed here] → Keep access and refresh secrets separate and configurable; add key identifiers/rotation only through a future approved security change.
- [New authentication tables become long-lived schema] → Keep them minimal, use additive migration only, and require approval before extending identity or retention semantics.

## Migration Plan

1. Confirm the recorded owner-approved session replacement, reuse response, and rate-limit policies, and obtain approval for any proposed major or high-migration-cost dependency.
2. Add validated local signing configuration and the additive User/Account/Session Prisma migration; verify existing foundation data remains intact.
3. Implement identity/session repositories and trusted session-issuance seam, then token primitives and guard/request context.
4. Implement transactional refresh, reuse handling, rate limiting, and sign-out endpoints with unit and PostgreSQL integration tests.
5. Add Swagger and security/session documentation before exposing the module to future provider work.
6. Add Flutter secure storage, authentication state, transports, single-flight refresh, retry, and sign-out behavior with fake-backed tests.
7. Run backend race/reuse/authorization integration tests and Flutter concurrent-request tests in CI and from a clean local setup.

Rollback before provider integration consists of reverting application changes and, only with separate destructive-migration approval, dropping the new empty authentication tables. The implementation SHALL NOT include an automatic destructive down migration or delete existing data.
