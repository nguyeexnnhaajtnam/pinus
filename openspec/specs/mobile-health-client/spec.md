# mobile-health-client Specification

## Purpose

Provide a minimal mobile experience that proves the approved client foundations can reach and represent the Pinus backend health contract.

## Requirements

### Requirement: Foundation-backed mobile startup
The Flutter application SHALL start with configured navigation, state management, HTTP client, and validated environment-specific API base URL foundations.

#### Scenario: Mobile starts with valid local configuration
- **WHEN** the application launches with a valid local API base URL
- **THEN** it displays the health screen through the configured application router

### Requirement: Health request lifecycle
The health screen SHALL request the backend health endpoint and display distinct loading, healthy, and failure states.

#### Scenario: Health request is in progress
- **WHEN** the application is waiting for the backend health response
- **THEN** the screen displays a loading state

#### Scenario: Backend reports healthy
- **WHEN** the backend returns a successful healthy response
- **THEN** the screen displays that the backend is healthy

#### Scenario: Backend is unreachable or unhealthy
- **WHEN** the health request fails or returns an unhealthy response
- **THEN** the screen displays a clear failure state and provides a way to retry the request

### Requirement: Platform-appropriate local connectivity
The local setup SHALL document API addressing needed for supported Android and iOS simulator environments.

#### Scenario: Developer runs on a supported simulator
- **WHEN** a developer configures the documented API base URL for an Android or iOS simulator
- **THEN** the mobile health request reaches the locally running backend
