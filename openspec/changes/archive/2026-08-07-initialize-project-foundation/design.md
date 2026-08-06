## Context

See `proposal.md` for motivation. Pinus currently contains planning documents but no applications or runtime infrastructure. DEC-001 approves a monorepo, and this change must create the foundation under `apps/mobile`, `apps/api`, and `infrastructure` without choosing production providers, creating recurring costs, or introducing later-phase features.

The foundation crosses the mobile client, API, spatial database, developer workflow, and CI. It must remain easy for one developer to run, diagnose, test, and replace as later decisions are approved.

## Goals / Non-Goals

**Goals:**

- Establish independently runnable Flutter and NestJS projects in the approved monorepo directories.
- Make configuration failures explicit and early in both applications.
- Prove end-to-end local connectivity through a small, documented health contract.
- Provide a spatially capable local database and repeatable Prisma migration workflow.
- Make logs, errors, API documentation, formatting, linting, and tests consistent enough to support later feature work.
- Keep local commands and CI checks aligned.

**Non-Goals:**

- Define domain entities or database tables for users, couples, Pins, media, or notifications.
- Establish production environment topology, deployment, providers, secrets management, monitoring, or costs.
- Add authentication, WebSockets, Redis, maps, background jobs, object storage, or release-store configuration.
- Fully design development/staging/production environment promotion; this change only creates a validated local configuration seam that can be extended after provider decisions.

## Decisions

### 1. Keep applications independent inside the approved monorepo

`apps/mobile` and `apps/api` will retain their native Flutter and Node/NestJS project structures and toolchains. Root documentation and CI orchestrate them; no additional monorepo build framework is introduced.

This follows DEC-001 while avoiding an unapproved major dependency and unnecessary orchestration complexity. A workspace/build orchestrator was considered, but its value is limited with two projects using different ecosystems and it would increase lock-in and setup work.

### 2. Organize the API by modules with a thin bootstrap layer

The NestJS root module will compose configuration, logging, database, and health modules. Cross-cutting bootstrap configuration will install validation, error handling, correlation, logging, and Swagger once. Future domain modules will be added alongside these foundations rather than creating a layered or microservice architecture.

A single flat application module was considered but would make later feature boundaries harder to maintain. Microservices are excluded by project policy.

### 3. Validate configuration at application boundaries

The API will parse environment variables into one validated configuration object during startup. At minimum, it will validate the server port, database URL, and environment name. The mobile application will receive an environment-specific API base URL at build/run time and validate its presence and URI shape before constructing the HTTP client. Example environment files will contain safe placeholders; real local files will be ignored by version control.

Scattered direct environment reads were considered but rejected because they defer errors and make configuration usage difficult to audit. Exact helper packages must be drawn from already approved dependencies or presented for owner approval before implementation if they qualify as major.

### 4. Run PostgreSQL/PostGIS as the only local infrastructure service

`infrastructure/docker-compose.yml` will define a pinned PostGIS-enabled PostgreSQL image, a named data volume, a health check, and local-only configuration supplied through environment values. The API will access it through Prisma. The initial migration will enable PostGIS without introducing product-domain models.

Installing PostgreSQL directly on each workstation was considered but is less reproducible. Adding Redis or production-like infrastructure was rejected as out of scope.

### 5. Use a small explicit health contract

The API will expose `GET /health` without authentication. A healthy response will use HTTP 200 and include a stable status value plus database-check status. A failed required check will return an HTTP service-unavailable response using a sanitized body. Swagger will document both outcomes.

The endpoint verifies API process readiness and database connectivity only. Deep checks of future services were considered but would couple this foundation to unselected providers and out-of-scope systems.

### 6. Centralize operational diagnostics

The API will use the approved Pino structured-logging direction, attach or propagate a correlation identifier for each request, and include it in request completion logs and global error responses. A global exception handler will normalize errors to a stable JSON envelope and omit stack traces and secrets from client responses. Development logs may be human-readable at the console boundary while preserving structured records as the service contract.

Ad hoc console logging and per-controller exception mapping were considered but rejected because they produce inconsistent diagnostics and duplicated behavior.

### 7. Use feature-oriented Flutter foundations for the health slice

The Flutter application will have an application layer for router/theme startup, a core configuration/network layer, and a health feature containing API access, Riverpod state, and presentation. Dio will use the validated base URL. GoRouter will expose the health screen as the initial route. The screen will render loading, healthy, and failure-with-retry states.

Direct networking in the widget was considered but would not establish reusable state and transport boundaries. Additional architecture frameworks, persistence, secure storage, localization, crash reporting, and production flavors are deferred because they are not needed to prove this change and some require later owner decisions.

### 8. Keep CI explicit per ecosystem

GitHub Actions will run separate mobile and API jobs with pinned toolchain versions, dependency caching where safe, formatting/lint checks, and tests. Database-dependent API tests will use an isolated CI PostgreSQL/PostGIS service only if the implemented health integration test needs it. The README will list equivalent local commands.

A single opaque root command or third-party CI service was considered but would obscure failures or select an unapproved provider. Deployment jobs are excluded.

### 9. Treat approval gates as implementation blockers, not placeholders

Before implementation adds any dependency beyond the approved technology direction, changes the three approved directory locations, selects a production service, creates recurring cost, or adds excluded behavior, work will stop for explicit owner approval. Routine development-only packages that implement already approved linting, validation, testing, Swagger, and structured logging remain subject to the decision policy's major-dependency threshold.

## Risks / Trade-offs

- [Local simulator networking differs by platform] → Document platform-specific loopback addresses and keep the API base URL configurable.
- [A health check can report success while feature behavior is broken] → Define it narrowly as process and database readiness; add domain checks only with future capabilities.
- [PostGIS support through Prisma may require raw SQL migrations] → Keep extension activation in a small reviewed migration and avoid spatial domain modeling in this change.
- [Generated Flutter and NestJS scaffolds add substantial boilerplate] → Retain only platform-required/generated files and keep custom foundation code focused on the specified paths.
- [CI and local tool versions can drift] → Pin supported versions in configuration and document them alongside commands.
- [Structured logs may accidentally capture secrets] → Use explicit redaction and tests for error responses; never log full environment objects or database URLs.
- [Combining all Phase 1 foundation work increases change size] → Implement in vertical checkpoints with independent lint/test verification and finish with the health call as the integration proof.

## Migration Plan

1. Create the approved directories and native application scaffolds without moving existing documentation or OpenSpec content.
2. Add local database infrastructure and validate PostGIS readiness.
3. Add the API configuration, Prisma, diagnostics, Swagger, and health slice; verify it independently.
4. Add the mobile foundations and health screen; verify on supported simulators against the local API.
5. Add documentation and CI, then run all documented checks from a clean setup.

Because this initializes an empty runtime foundation, there is no user-data migration. Rollback consists of reverting the foundation change and removing only its local containers/volumes when the developer explicitly chooses to discard local data; no automated destructive cleanup will be added.
