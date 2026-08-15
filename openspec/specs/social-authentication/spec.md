# social-authentication Specification

## Purpose

Allow clients to exchange backend-verified Google or Apple identity tokens for Pinus credentials without trusting client-asserted identity data.

## Requirements

### Requirement: Only approved social providers are accepted
The backend SHALL expose social-authentication operations for Google and Apple only and SHALL reject any unsupported provider without attempting identity creation.

#### Scenario: Google authentication is requested
- **WHEN** a client submits a Google identity token to the Google social-authentication operation
- **THEN** the backend evaluates it using the Google verification contract

#### Scenario: Apple authentication is requested
- **WHEN** a client submits an Apple identity token to the Apple social-authentication operation
- **THEN** the backend evaluates it using the Apple verification contract

#### Scenario: Unsupported provider is requested
- **WHEN** a client attempts to authenticate with a provider other than Google or Apple
- **THEN** the backend rejects the request and creates no User, Account, or Session

### Requirement: Google identity tokens are verified by the backend
The backend SHALL accept Google identity only after verifying the identity token's signature against trusted Google keys and validating its approved issuer, configured backend audience, subject, issued-at time, and expiry.

#### Scenario: Valid Google identity token is submitted
- **WHEN** a Google identity token has a trusted signature and all required claims match the configured Google verification policy
- **THEN** the backend derives the provider subject and optional email from the verified token

#### Scenario: Invalid Google token is submitted
- **WHEN** a Google identity token has an invalid signature, issuer, audience, subject, issued-at time, expiry, or malformed claim
- **THEN** the backend rejects authentication with a sanitized error and creates no identity or Session state

### Requirement: Apple identity tokens are verified by the backend
The backend SHALL accept Apple identity only after verifying the identity token's signature against trusted Apple keys and validating its approved issuer, configured audience, subject, issued-at time, expiry, and nonce binding when a nonce is required by the client flow.

#### Scenario: Valid Apple identity token is submitted
- **WHEN** an Apple identity token has a trusted signature and all required claims match the configured Apple verification policy and nonce binding
- **THEN** the backend derives the provider subject and optional email from the verified token

#### Scenario: Invalid Apple token is submitted
- **WHEN** an Apple identity token has an invalid signature, issuer, audience, subject, issued-at time, expiry, malformed claim, or nonce binding
- **THEN** the backend rejects authentication with a sanitized error and creates no identity or Session state

### Requirement: Client identity assertions are never trusted
The social-authentication API SHALL accept provider credential material needed for backend verification and SHALL NOT accept a client-supplied Pinus User identifier, provider subject, or email as authoritative identity evidence.

#### Scenario: Client attempts to assert identity fields
- **WHEN** a request includes an unverified User identifier, provider subject, or email in addition to or instead of a provider identity token
- **THEN** the backend ignores or rejects those fields and derives identity only from the verified provider token

### Requirement: Verified identity is exchanged for Pinus credentials
After provider verification and identity resolution succeed, the backend SHALL create a Session through the existing authentication foundation and SHALL return a Pinus access token and refresh token governed by the existing Pinus token and Session lifecycle.

#### Scenario: Social authentication succeeds
- **WHEN** a valid Google or Apple identity resolves to a User and Account
- **THEN** the backend creates a Session under the existing five-active-Session policy and returns one Pinus token pair

#### Scenario: Session creation fails
- **WHEN** provider verification succeeds but the existing authentication foundation cannot create a consistent Session
- **THEN** the backend returns a sanitized failure without returning partial credentials

### Requirement: Provider tokens are ephemeral and redacted
The system SHALL retain provider identity tokens only for the duration required to verify and exchange them and SHALL exclude provider tokens, provider credentials, and verified-token payloads containing personal information from persistent storage and logs.

#### Scenario: Authentication request is processed
- **WHEN** a provider identity token is received, verified, accepted, or rejected
- **THEN** neither the token nor provider credentials are persisted or emitted to application logs

### Requirement: Social authentication is rate limited and sanitized
Social-authentication endpoints SHALL apply the existing authentication limit of 10 requests per minute per source IP and SHALL return stable, sanitized provider-neutral errors for invalid credentials, provider-key failures, provider unavailability, and rate-limit rejection.

#### Scenario: Social authentication rate limit is exceeded
- **WHEN** social-authentication requests from one source IP exceed 10 requests in one minute
- **THEN** the backend returns HTTP 429 without verifying another provider token or mutating User, Account, or Session state

#### Scenario: Provider verification dependency fails
- **WHEN** trusted provider keys cannot be obtained or provider verification cannot complete temporarily
- **THEN** the backend returns a retryable sanitized error without disclosing provider credentials or internal verification details
