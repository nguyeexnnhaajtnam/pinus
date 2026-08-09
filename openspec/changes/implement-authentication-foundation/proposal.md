## Why

Phase 2 needs a secure identity and session substrate before concrete Google or Apple login integrations can be added. Building the backend token lifecycle and Flutter client behavior now isolates provider verification from session security and gives future private APIs a consistent authentication contract.

## What Changes

- Add the approved `User`, `Account`, and `Session` domain direction to Prisma, including provider-subject identity uniqueness, nullable email, multiple device sessions, refresh-token hash state, expiry, and revocation metadata.
- Add a NestJS authentication module that can create a session only from a trusted backend-verified identity boundary, issue and verify 15-minute JWT access tokens, and issue, rotate, hash, verify, and revoke 30-day refresh tokens.
- Add authenticated request context and a guard that rejects invalid tokens and sessions that are expired or revoked.
- Add refresh, sign-out-current-session, and sign-out-all-other-sessions endpoints with transaction-safe rotation, a maximum of five active sessions per user, oldest-active-session replacement on the sixth session, authentication endpoint rate limiting, and sanitized failures.
- Revoke the affected device Session when a valid rotated refresh token is reused, require authentication again on that device, and cover concurrency and reuse behavior with authorization, session, race-condition, and reuse integration tests.
- Rate limit authentication endpoints to 10 requests per minute per IP and additionally limit refresh to 30 requests per minute per Session.
- Add Flutter secure token storage, authentication state, an authenticated Dio client, access-token attachment, single-flight refresh, one-time request retry, and permanent-failure cleanup.
- Update Swagger and local documentation for authentication testing, session lifecycle, and security assumptions.
- Keep provider-specific login, any client-trusted identity bootstrap, email/password, registration/login UI, profile editing, account deletion, Redis, managed authentication, provider credentials, and production secrets outside this change.
- Preserve owner approval gates for token lifetimes, the five-session limit, the approved identity-model direction, providers, managed authentication, privacy/account-deletion behavior, high-migration-cost dependencies, and scope expansion.

## Capabilities

### New Capabilities

- `identity-session-domain`: Persistent identity, linked external-account, and multi-device session behavior based on `User`, `Account`, and `Session`.
- `backend-token-authentication`: Backend access-token authorization, refresh rotation, session revocation, reuse/race protection, request context, and authentication endpoint throttling.
- `mobile-authentication-client`: Secure Flutter token persistence, authentication state, authenticated requests, single-flight refresh, retry, and permanent-failure cleanup.

### Modified Capabilities

None.

## Impact

- Affects the Prisma schema and adds a non-destructive migration for new authentication tables, constraints, and indexes under `apps/api`.
- Adds authentication modules, public session-management endpoints, protected-route infrastructure, Swagger contracts, tests, and local documentation to the NestJS application.
- Adds secure platform storage and authenticated networking/state foundations to the Flutter application without adding login UI or a social-provider SDK.
- Introduces security-sensitive signing, hashing, rate-limiting, and secure-storage dependencies; implementation must use approved or low-migration-cost options and stop for owner approval before adding a major dependency.
- Does not provision a provider, managed authentication service, Redis, production secret store, or recurring-cost service.
