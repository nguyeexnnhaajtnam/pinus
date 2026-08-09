# Pinus API

NestJS modular-monolith backend using Prisma and PostgreSQL/PostGIS.

## Local setup

1. Copy `infrastructure/.env.example` to `infrastructure/.env` and `apps/api/.env.example` to `apps/api/.env`.
2. Replace the local JWT placeholders with two different values of at least 32 characters. Never commit real signing secrets.
3. Start PostgreSQL with `docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml up -d`.
4. From `apps/api`, run `npm ci`, `npm run prisma:generate`, and `npm run prisma:deploy`.
5. Run `npm run start:dev`. Swagger is available at `http://localhost:3000/docs`.

## Authentication testing

No development-login endpoint exists. Integration tests seed a `User` and `Account` directly, then invoke the internal `AuthService.issueForVerifiedIdentity` seam with a test-only verified identity. Run them against the local database with `npm run test:e2e -- --runInBand`.

## Session lifecycle

- A backend-verified provider identity resolves an `Account`; email is never identity proof.
- A Session lasts at most 30 days and receives a 15-minute access JWT plus a rotating refresh JWT.
- Only the current refresh-token SHA-256 hash is stored. Rotation uses a transactional version/hash compare-and-swap.
- A sixth active Session atomically revokes the oldest active Session (`createdAt`, then Session ID) before creation.
- Cryptographically valid rotated-token reuse revokes that device Session and requires authentication again. Concurrent duplicate refreshes intentionally have the same response.
- Current sign-out revokes only the calling Session. Sign-out-others keeps the calling Session active.

## Security assumptions

Provider signatures, issuer, audience, expiry, nonce, and subject will be verified by a future backend provider adapter. Mobile-supplied provider identity fields are never trusted. Access authorization checks live Session state for immediate revocation. Auth endpoints are process-limited to 10 requests/minute/IP; refresh is additionally limited to 30 requests/minute/verified Session. These counters are not distributed across future replicas. Redis, provider credentials, production key management, signing-key rotation, account deletion, and retention policy are outside this foundation.
