## Purpose

Provide Flutter users with Google and Apple sign-in flows that exchange provider proof for securely stored Pinus authentication credentials.

## ADDED Requirements

### Requirement: Mobile supports Google and Apple sign-in
The mobile application SHALL offer Google Sign-In and Sign in with Apple only where the respective provider is configured and available on the current platform.

#### Scenario: Provider is available
- **WHEN** a configured Google or Apple provider is supported on the current platform
- **THEN** the application makes that provider's sign-in action available

#### Scenario: Provider is unavailable
- **WHEN** a provider is unsupported, unavailable, or not configured on the current platform
- **THEN** the application disables or omits that provider action without blocking an available approved provider

### Requirement: Provider sign-in exchanges only identity proof
After a provider sign-in succeeds, the mobile application SHALL send the provider identity token and only verification-bound auxiliary values to the matching Pinus backend operation and SHALL NOT send client-derived User, email, or provider-subject values as identity evidence.

#### Scenario: Google provider returns identity proof
- **WHEN** Google Sign-In successfully returns a Google identity token
- **THEN** the application submits that token to the Google backend authentication operation

#### Scenario: Apple provider returns identity proof
- **WHEN** Sign in with Apple successfully returns an Apple identity token and nonce-bound values required by the flow
- **THEN** the application submits them to the Apple backend authentication operation

### Requirement: Successful login enters authenticated state
The mobile application SHALL persist the Pinus access and refresh token pair returned by successful social authentication through the existing secure token storage before entering authenticated state.

#### Scenario: Backend exchange succeeds
- **WHEN** the Pinus backend returns a valid Pinus token pair after social authentication
- **THEN** the application stores the pair through the existing secure-storage abstraction and transitions to authenticated state

#### Scenario: Application restarts after login
- **WHEN** the application restarts with the stored Pinus token pair
- **THEN** the existing authentication foundation restores authenticated state without reusing or persisting the provider identity token

### Requirement: Login exposes deterministic progress and failure states
The mobile application SHALL expose a provider-specific login loading state while one login attempt is active and a sanitized recoverable login error state when provider initiation or backend exchange fails.

#### Scenario: Login is in progress
- **WHEN** a user starts an available provider login and the provider or backend exchange has not completed
- **THEN** the application shows loading for that attempt and prevents duplicate submission of the same action

#### Scenario: Provider or backend login fails
- **WHEN** provider sign-in fails or the backend rejects or cannot complete the exchange
- **THEN** the application leaves Pinus credentials unchanged, exits loading, and presents a sanitized recoverable error

### Requirement: User cancellation is not treated as an authentication error
The mobile application SHALL return to the unauthenticated idle state without showing a failure when the user cancels Google or Apple sign-in.

#### Scenario: User cancels provider sign-in
- **WHEN** the provider reports that the user cancelled the login flow
- **THEN** the application creates no backend exchange, stores no credentials, and returns to the idle unauthenticated state

### Requirement: Provider credentials remain transient on mobile
The mobile application SHALL NOT place provider identity tokens or provider credentials in application logs, ordinary preferences, analytics, or long-lived application state and SHALL release them after the backend exchange completes or fails.

#### Scenario: Login attempt finishes
- **WHEN** a Google or Apple login attempt succeeds, fails, or is cancelled
- **THEN** provider credential material is not retained beyond the active authentication operation
