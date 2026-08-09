## 1. Approval and Security Baseline

- [x] 1.1 Confirm the implementation baseline records the owner-approved oldest-active-Session replacement, affected-device Session revocation on valid rotated-token reuse, 10 requests/minute/IP authentication limit, and additional 30 requests/minute/Session refresh limit.
- [x] 1.2 Confirm the implementation preserves the approved 15-minute access lifetime, 30-day refresh lifetime, five-Session limit, and User/Account/Session model direction.
- [x] 1.3 Review proposed authentication and secure-storage dependencies and obtain owner approval before adding any major or high-migration-cost dependency.
- [x] 1.4 Add separate access/refresh signing configuration, issuer, and audience to environment validation and local examples without adding production secrets.

## 2. Prisma Identity and Session Persistence

- [x] 2.1 Add the minimal User model with a generated stable identifier and audit timestamps.
- [x] 2.2 Add the Account model with a User relation, normalized provider, opaque provider subject, nullable informational email, unique provider-subject constraint, and lookup indexes.
- [x] 2.3 Add the Session model with User ownership, current refresh-token hash and version, fixed expiry, revocation, usage, and audit timestamps plus active-session indexes.
- [x] 2.4 Generate an additive Prisma migration and verify it applies cleanly to the local PostgreSQL database without destructive changes.
- [x] 2.5 Implement repository transaction helpers that exclude expired/revoked Sessions, deterministically select the oldest active Session by creation time and Session ID, and preserve the five-active-Session invariant during concurrent replacement.

## 3. Authentication Module and Token Primitives

- [x] 3.1 Add the NestJS authentication module with separated controller, application service, persistence, token, guard, and request-context responsibilities.
- [x] 3.2 Implement separate access- and refresh-JWT issuing and verification services with explicit token types, required claims, independent secrets, and approved lifetimes.
- [x] 3.3 Implement refresh-token SHA-256 hashing, constant-time comparison where applicable, and logger/error redaction for tokens, hashes, authorization headers, and signing configuration.
- [x] 3.4 Define a typed internal trusted-identity contract for future backend provider verifiers without exposing a public identity-spoofing or development-login route.
- [x] 3.5 Implement trusted Session issuance with Account lookup and transactional revocation of the oldest active Session before creating a sixth Session.

## 4. Backend Authorization and Session Lifecycle

- [x] 4.1 Implement the authentication guard to verify access claims and require a live, unexpired, unrevoked Session owned by the claimed User.
- [x] 4.2 Add an immutable current-user request context and controller decorator derived only from the verified User and Session claims.
- [x] 4.3 Add the refresh endpoint DTOs, validation, sanitized error identifiers, and response contract.
- [x] 4.4 Implement refresh rotation as a transaction with an expected version/hash compare-and-swap so one current token rotates exactly once.
- [x] 4.5 Implement approved valid-stale-token reuse handling that atomically revokes the affected Session while ensuring unverifiable claims cannot trigger revocation.
- [x] 4.6 Add an idempotent current-session sign-out endpoint that revokes only the requesting Session.
- [x] 4.7 Add a sign-out-all-other-sessions endpoint that atomically revokes only other active Sessions owned by the current User.
- [x] 4.8 Add replaceable process-local rate limiting of 10 requests per minute per IP to all authentication endpoints and an additional 30 requests per minute per verified Session to refresh, returning sanitized HTTP 429 responses without Redis.
- [x] 4.9 Verify global error handling and structured logging expose no token, identity-existence, Session-existence, provider-subject, hash, or signing-key details.

## 5. Backend Tests

- [x] 5.1 Add unit tests for token type separation, claims, approved lifetimes, hashing, configuration validation, redaction, and sanitized failures.
- [x] 5.2 Add persistence tests for provider-subject uniqueness, nullable/non-identifying email behavior, User ownership, and active-Session queries.
- [x] 5.3 Add authorization integration tests for valid access, wrong token type, expired/revoked Session, mismatched ownership, and current-user context.
- [x] 5.4 Add Session-creation integration tests proving a sixth Session atomically revokes the deterministic oldest active Session, concurrent creation never exceeds five, and no operation leaves partial state.
- [x] 5.5 Add refresh integration tests for successful rotation, expiry, revocation, wrong token type, invalid signature, and fixed Session expiry.
- [x] 5.6 Add a deterministic race test proving concurrent use of one current refresh token produces at most one successful rotation, the losing valid replay revokes the device Session, and no concurrently issued successor remains valid.
- [x] 5.7 Add reuse tests proving valid stale-token replay revokes only the affected device Session and requires authentication again while fabricated stale claims do not revoke a Session.
- [x] 5.8 Add sign-out integration tests for current-only and all-other scopes, idempotency, unauthenticated access, and cross-User isolation.
- [x] 5.9 Add rate-limit tests for 10 requests/minute/IP across authentication endpoints and the additional 30 requests/minute/Session refresh limit, proving either excess returns 429 without token or Session mutation.

## 6. Flutter Secure Authentication Foundation

- [x] 6.1 Add a SecureTokenStorage interface and versioned token-pair model that reads, writes, and deletes the pair as one secure value.
- [x] 6.2 Add the approved secure-storage adapter for iOS Keychain and Android secure platform storage plus an in-memory fake for tests.
- [x] 6.3 Add Riverpod authentication state with initializing, unauthenticated, authenticated, and refresh-failure transitions and startup restoration.
- [x] 6.4 Separate the low-level public/refresh Dio transport from the authenticated Dio transport to prevent interceptor recursion.
- [x] 6.5 Add access-token attachment for protected requests, an explicit public-endpoint allowlist, and token-safe request logging.
- [x] 6.6 Implement a shared in-flight refresh Future so concurrent authorization failures await one refresh operation.
- [x] 6.7 Persist a successful rotated token pair before retrying each eligible original request exactly once with a retry marker.
- [x] 6.8 Distinguish permanent refresh rejection from retryable transport failure, clearing local credentials only for permanent authentication failure.
- [x] 6.9 Add current-session and all-other-session sign-out client behavior with the required local authentication-state transitions.

## 7. Flutter Tests

- [x] 7.1 Add unit tests for secure token-pair read, atomic write, delete, incomplete/corrupt data, and storage errors.
- [x] 7.2 Add authentication-state tests for startup restoration, missing credentials, successful updates, and clearing credentials.
- [x] 7.3 Add Dio tests for bearer attachment, public-endpoint exclusion, and absence of token values in logs.
- [x] 7.4 Add concurrent-request tests proving multiple authorization failures produce one refresh request and all waiters receive its result.
- [x] 7.5 Add tests proving successful refresh persists the new pair before one retry and a second unauthorized response cannot loop.
- [x] 7.6 Add tests proving permanent refresh rejection clears state for all waiters while retryable network failure preserves the stored pair.
- [x] 7.7 Add tests for current-session sign-out clearing local state and all-other-session sign-out retaining it.

## 8. Documentation and Verification

- [x] 8.1 Update Swagger with refresh and sign-out contracts, authentication requirements, 429 responses, and sanitized examples containing no real tokens.
- [x] 8.2 Document local authentication testing through test-only in-process trusted identity fixtures without adding a callable development-login endpoint.
- [x] 8.3 Document Session creation, oldest-active replacement on the sixth Session, rotation, expiry, affected-device reuse response, current sign-out, and other-session sign-out lifecycle behavior.
- [x] 8.4 Document security assumptions, provider-verification boundary, token storage/redaction, process-local rate-limit limitation, and deferred key rotation/account deletion.
- [x] 8.5 Update local setup and environment documentation with placeholders only and verify no secret or plaintext refresh token is committed.
- [x] 8.6 Extend CI to run backend formatting, linting, unit and PostgreSQL integration tests plus Flutter analysis and unit tests for this foundation.
- [x] 8.7 Run backend and Flutter formatting, linting, builds, unit tests, integration/race tests, and a clean local setup verification.
- [x] 8.8 Audit the completed change against all delta specs and confirm no provider, login UI, profile, account-deletion, Redis, production-secret, or other out-of-scope implementation was added.
