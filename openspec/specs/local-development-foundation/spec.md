# local-development-foundation Specification

## Purpose

Provide a reproducible, validated local environment in which developers can run the approved Pinus mobile, API, and spatial database foundation.

## Requirements

### Requirement: Approved repository layout
The project SHALL place the Flutter application in `apps/mobile`, the NestJS application in `apps/api`, and local infrastructure definitions in `infrastructure`.

#### Scenario: Foundation files are inspected
- **WHEN** a developer inspects the initialized repository
- **THEN** the mobile, API, and infrastructure projects are located in their approved directories

### Requirement: Local spatial database
The local development environment SHALL provide PostgreSQL with the PostGIS extension available through Docker Compose.

#### Scenario: Database stack starts
- **WHEN** a developer starts the documented Docker Compose services
- **THEN** PostgreSQL becomes reachable and PostGIS is enabled in the application database

### Requirement: Prisma workflow
The API project SHALL connect to the local database through Prisma and SHALL provide a documented workflow for generating the client and applying development migrations.

#### Scenario: Developer prepares a clean database
- **WHEN** a developer follows the documented Prisma setup workflow against a fresh local database
- **THEN** the Prisma client is generated and all development migrations apply successfully

### Requirement: Configuration validation
Each application SHALL validate its required environment configuration and SHALL report missing or invalid values before attempting normal operation.

#### Scenario: Required configuration is missing
- **WHEN** the mobile or API application starts without a required environment value
- **THEN** startup stops or the application presents an explicit configuration error identifying the invalid setting

### Requirement: Reproducible local setup documentation
The repository SHALL document prerequisites, environment-file creation, dependency installation, database startup, migrations, API startup, mobile startup, linting, and tests without requiring a production provider or paid service.

#### Scenario: New developer follows setup guide
- **WHEN** a developer with the documented prerequisites follows the local setup instructions from a clean clone
- **THEN** the database, API, and mobile application can run and communicate locally without committed secrets
