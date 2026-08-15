# Pinus API

NestJS modular-monolith backend using Prisma and PostgreSQL/PostGIS.

## Local setup

1. Copy `infrastructure/.env.example` to `infrastructure/.env` and `apps/api/.env.example` to `apps/api/.env`.
2. Replace the local JWT placeholders with two different values of at least 32 characters. Set `GOOGLE_AUTH_AUDIENCES` to the comma-separated Google OAuth client IDs accepted by the backend and `APPLE_AUTH_AUDIENCES` to the comma-separated Apple bundle/service IDs. Never commit real signing secrets or provider credentials.
3. Start PostgreSQL with `docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml up -d`.
4. From `apps/api`, run `npm ci`, `npm run prisma:generate`, and `npm run prisma:deploy`.
5. Run `npm run start:dev`. Swagger is available at `http://localhost:3000/docs`.

## Authentication testing

No development-login endpoint exists. Social login is exposed only through `POST /auth/social/google` and `POST /auth/social/apple`. The client sends a short-lived provider identity token; Apple also requires the ephemeral raw nonce generated before authorization. The API verifies the signature, issuer, audience, lifetime, subject and Apple nonce before resolving identity and issuing Pinus tokens.

Unit tests use controlled keys and fakes; PostgreSQL integration tests seed or verify identities directly. Run them with `npm test -- --runInBand` and `npm run test:e2e -- --runInBand`. A real-provider smoke test requires locally configured Google/Apple applications and must never add tokens, private keys, downloaded credential files, or production identifiers to the repository.

Temporary provider/JWK failure returns a retryable provider-unavailable response. Invalid credentials return the same sanitized unauthorized response regardless of whether an Account exists. Provider tokens, nonces and verified payloads are neither persisted nor logged.

## Session lifecycle

- A backend-verified `(provider, providerSubject)` resolves an `Account`; email is optional profile information and is never identity proof or an automatic merge key.
- Concurrent first login uses a serializable transaction. A uniqueness/serialization loser reloads the winning Account, so no losing User remains committed.
- A Session lasts at most 30 days and receives a 15-minute access JWT plus a rotating refresh JWT.
- Only the current refresh-token SHA-256 hash is stored. Rotation uses a transactional version/hash compare-and-swap.
- A sixth active Session atomically revokes the oldest active Session (`createdAt`, then Session ID) before creation.
- Cryptographically valid rotated-token reuse revokes that device Session and requires authentication again. Concurrent duplicate refreshes intentionally have the same response.
- Current sign-out revokes only the calling Session. Sign-out-others keeps the calling Session active.

## Security assumptions

Provider signatures, issuer, audience, issued-at, expiry, nonce, and subject are verified by backend adapters. Mobile-supplied user IDs, subjects and emails are never trusted. Access authorization checks live Session state for immediate revocation. Auth endpoints are process-limited to 10 requests/minute/IP; refresh is additionally limited to 30 requests/minute/verified Session. These counters are not distributed across future replicas. Redis, provider credentials, production key management, signing-key rotation, account linking/deletion, and retention policy are outside this change.
