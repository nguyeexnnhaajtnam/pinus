## 1. Approval and Repository Baseline

- [x] 1.1 Review the proposed runtime and development dependency list against the approved stack, and obtain owner approval before adding any unapproved major dependency.
- [x] 1.2 Record supported Flutter, Dart, Node.js, package-manager, Docker, and Docker Compose versions for local development and CI.
- [x] 1.3 Initialize the Flutter project at `apps/mobile`, the NestJS project at `apps/api`, and local infrastructure files at `infrastructure` without relocating existing documentation or OpenSpec artifacts.
- [x] 1.4 Configure repository ignore rules so generated output, local environment files, credentials, and local database data cannot be committed.

## 2. Local PostgreSQL, PostGIS, and Prisma

- [x] 2.1 Add a pinned PostgreSQL/PostGIS Docker Compose service with a named volume, environment-driven local credentials, port mapping, and container health check under `infrastructure`.
- [x] 2.2 Add safe local environment examples and verify Docker Compose rejects or clearly documents missing required database values.
- [x] 2.3 Configure Prisma in `apps/api` to use the validated database URL and add the initial migration that enables PostGIS without adding product-domain models.
- [x] 2.4 Verify a clean local database starts healthy, reports the PostGIS extension, generates the Prisma client, and applies all migrations.

## 3. NestJS Application Foundation

- [x] 3.1 Organize the NestJS application as a modular monolith with separate configuration, database, health, and cross-cutting infrastructure modules composed by the root module.
- [x] 3.2 Implement startup validation for the API environment name, server port, and database URL, with focused tests for valid, missing, and malformed configuration.
- [x] 3.3 Add a reusable Prisma service/module with connection lifecycle handling and a database connectivity operation suitable for health checks.
- [x] 3.4 Configure Pino structured lifecycle and HTTP request logging with correlation identifiers, secret redaction, and tests or assertions for required request metadata.
- [x] 3.5 Add a global exception handler that returns the specified stable JSON error envelope, preserves safe HTTP errors, sanitizes unexpected errors, and never returns stack traces.
- [x] 3.6 Configure Swagger/OpenAPI at a documented local path and describe the health success and failure responses.
- [x] 3.7 Implement unauthenticated `GET /health` process and database checks with HTTP 200 for healthy status and service-unavailable behavior for failed database connectivity.
- [x] 3.8 Add API unit and integration tests covering startup configuration, health success, health database failure, error-envelope fields, correlation identifiers, and response sanitization.
- [x] 3.9 Configure backend formatting and lint commands and verify they pass with the backend test suite.

## 4. Flutter Application Foundation

- [x] 4.1 Configure the Flutter application entry point with Riverpod and a GoRouter initial health route using a feature-oriented application/core/health structure.
- [x] 4.2 Implement build/run-time API base URL loading and validation, including clear startup behavior and tests for missing or malformed values.
- [x] 4.3 Configure a shared Dio client from validated configuration and add a health API client that parses healthy responses and represents transport, server, and malformed-response failures.
- [x] 4.4 Implement Riverpod health state and retry behavior for the initial request lifecycle.
- [x] 4.5 Build the minimal health screen with distinct accessible loading, healthy, and failure states and a retry action.
- [x] 4.6 Add Flutter unit and widget tests for configuration validation, health response parsing, loading, healthy, failure, and retry scenarios.
- [x] 4.7 Configure Flutter formatting and analysis rules and verify they pass with the Flutter test suite.

## 5. End-to-End Local Workflow and Documentation

- [x] 5.1 Verify the Flutter health screen reaches the local API from supported Android and iOS simulators using platform-appropriate configurable addresses.
- [x] 5.2 Add root local-setup documentation covering prerequisites, safe environment-file creation, dependencies, Docker Compose, Prisma generation/migrations, API startup, Swagger, mobile startup, simulator networking, formatting, linting, and tests.
- [x] 5.3 Validate the documented setup from a clean-clone-equivalent state without production providers, paid services, committed secrets, or manual steps omitted from the guide.

## 6. Continuous Integration and Final Verification

- [x] 6.1 Add GitHub Actions mobile and API jobs with pinned toolchains and safe dependency caching.
- [x] 6.2 Configure CI to run the documented Flutter formatting, analysis, and test commands and expose the failing command when a check fails.
- [x] 6.3 Configure CI to run the documented NestJS formatting/lint and test commands, adding an isolated PostgreSQL/PostGIS service only for tests that require database connectivity.
- [x] 6.4 Run all local formatting, lint, unit, integration, and widget tests; confirm CI uses equivalent rules and commands.
- [x] 6.5 Perform a final scope audit confirming no authentication, profile, couple invitation, map, Pin, media, notification, WebSocket, Redis, production-provider, object-storage, or app-store work was introduced.
