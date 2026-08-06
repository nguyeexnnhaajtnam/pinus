## Why

Pinus has approved product direction and repository structure but no runnable mobile, backend, database, or continuous-integration foundation. Phase 1 needs a reproducible local baseline so later product changes can be implemented and tested without repeatedly solving project setup and connectivity concerns.

## What Changes

- Establish the approved monorepo application layout with Flutter in `apps/mobile`, NestJS in `apps/api`, and local infrastructure definitions in `infrastructure`.
- Provide the Flutter foundations for Riverpod state management, GoRouter navigation, Dio HTTP access, environment validation, linting, formatting, and tests.
- Provide a NestJS modular-monolith foundation with Prisma, environment validation, structured logging, global error handling, Swagger documentation, linting, formatting, and tests.
- Provide a local Docker Compose PostgreSQL service with PostGIS enabled and a documented Prisma migration workflow.
- Expose a backend health-check endpoint and a minimal Flutter screen that calls it and displays loading, success, and failure states.
- Document local setup and add CI checks for linting and tests.
- Keep authentication, user and couple features, maps, Pins, media, notifications, WebSockets, Redis, and all production infrastructure outside this change.
- Require owner approval before adding an unapproved major dependency, changing the approved repository structure, selecting a production provider, adding recurring cost, or expanding scope.

## Capabilities

### New Capabilities

- `local-development-foundation`: Reproducible local setup for the approved mobile, API, PostgreSQL/PostGIS, Prisma, configuration-validation, and developer-documentation baseline.
- `backend-service-foundation`: Operational NestJS modular service behavior including validated startup, structured logging, global error responses, Swagger, and health reporting.
- `mobile-health-client`: Minimal Flutter application behavior that uses the approved client foundations to request and display backend health.
- `continuous-integration-quality`: Automated lint and test checks for the mobile and backend projects.

### Modified Capabilities

None.

## Impact

- Creates future implementation targets under `apps/mobile`, `apps/api`, and `infrastructure` while retaining product documentation and OpenSpec artifacts in the repository root.
- Introduces local development dependencies for Flutter, NestJS, Riverpod, GoRouter, Dio, Prisma, PostgreSQL/PostGIS, Docker Compose, Swagger, structured logging, validation, linting, formatting, and testing; exact packages must remain within the approved stack or receive owner approval when they qualify as major dependencies.
- Defines the first local API contract for health status and the mobile-to-backend connectivity path.
- Adds CI workflow configuration but does not select or provision production hosting, databases, storage, monitoring, or paid services.
