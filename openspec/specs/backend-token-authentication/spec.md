# backend-token-authentication Specification

## Purpose

Provide a secure backend contract for short-lived authorization, rotating session credentials, revocation, and authenticated request identity.

## Requirements

### Requirement: Approved token lifetimes and separation
The backend SHALL issue JWT access tokens valid for 15 minutes and rotating refresh tokens valid no longer than 30 days, and SHALL distinguish token type so a refresh token cannot authorize an API request and an access token cannot rotate a Session.

#### Scenario: Valid access token is presented
- **WHEN** an unexpired access token with the expected issuer, audience, type, User, and Session claims is presented to a protected endpoint
- **THEN** the backend evaluates it as an access credential for that User and Session

#### Scenario: Wrong token type is presented
- **WHEN** a refresh token is presented to a protected endpoint or an access token is presented to the refresh endpoint
- **THEN** the backend rejects the credential without exposing token details

### Requirement: Active session authorization
The authentication guard SHALL authorize a protected request only when the access token is valid and its referenced Session belongs to the referenced User and is neither expired nor revoked.

#### Scenario: Active session accesses protected route
- **WHEN** a valid access token references an active Session owned by its User
- **THEN** the guard authorizes the request and supplies an immutable current-user context containing the User and Session identifiers

#### Scenario: Session was revoked after access token issuance
- **WHEN** an otherwise valid access token references a revoked Session
- **THEN** the guard rejects the request immediately rather than waiting for access-token expiry

### Requirement: Refresh tokens are never stored in plaintext
The backend SHALL persist only a one-way cryptographic hash of the current refresh token and SHALL exclude access tokens, refresh tokens, signing secrets, and token hashes from logs and API responses except for the newly issued plaintext tokens returned once to the authenticated client.

#### Scenario: Session record and logs are inspected
- **WHEN** a Session is created or refreshed
- **THEN** persistent storage and structured logs contain no recoverable plaintext token

### Requirement: Successful refresh rotates exactly once
The refresh endpoint SHALL accept only the current valid refresh token for an active Session and SHALL atomically replace its stored hash and rotation state before returning a new access-token and refresh-token pair.

#### Scenario: Current refresh token is used
- **WHEN** the current unexpired refresh token is submitted for an active Session
- **THEN** the backend invalidates that token, stores only the new token hash, advances rotation state once, and returns one new token pair

#### Scenario: Concurrent requests use the same refresh token
- **WHEN** two refresh requests race with the same current token
- **THEN** no more than one request rotates the Session and no state exists in which both returned refresh tokens are valid

### Requirement: Rotated refresh-token reuse revokes the session
The backend SHALL detect a cryptographically valid refresh token whose rotation state is older than the active Session state, SHALL revoke that affected device Session as potentially compromised, SHALL reject the refresh without issuing tokens, and SHALL require that device to authenticate again.

#### Scenario: Previously rotated token is replayed
- **WHEN** a valid refresh token that was already rotated is submitted again
- **THEN** the backend atomically revokes the affected Session, rejects the request with a sanitized authentication error, and subsequent access or refresh tokens for that Session are rejected

#### Scenario: Fabricated stale token is submitted
- **WHEN** a token claims an older rotation state but fails cryptographic verification
- **THEN** the backend rejects it without revoking a Session based only on untrusted claims

### Requirement: Current-session sign-out
An authenticated client SHALL be able to revoke its current Session, after which the Session's access and refresh credentials are rejected.

#### Scenario: User signs out current session
- **WHEN** an authenticated request invokes the current-session sign-out endpoint
- **THEN** the backend revokes that Session idempotently and does not revoke the User's other Sessions

### Requirement: Sign out all other sessions
An authenticated client SHALL be able to revoke every active Session owned by the current User except the Session making the request.

#### Scenario: User signs out other devices
- **WHEN** an authenticated request invokes the all-other-sessions sign-out endpoint
- **THEN** the backend atomically revokes the User's other active Sessions and keeps the current Session active

#### Scenario: User attempts to affect another user's sessions
- **WHEN** session identifiers or ownership claims supplied by the client refer to another User
- **THEN** the backend derives ownership from current-user context and does not revoke or disclose another User's Sessions

### Requirement: Authentication endpoint rate limiting
The backend SHALL rate limit all authentication endpoints to 10 requests per minute per source IP, SHALL additionally limit refresh requests to 30 requests per minute per verified Session, and SHALL return a retryable HTTP 429 response when either applicable limit is exceeded.

#### Scenario: Authentication request limit is exceeded
- **WHEN** requests to authentication endpoints exceed 10 requests in one minute for a source IP
- **THEN** the backend rejects excess requests without performing token or Session mutation and without requiring Redis

#### Scenario: Refresh session limit is exceeded
- **WHEN** refresh requests for a verified Session exceed 30 requests in one minute even though the source-IP limit has not been exceeded
- **THEN** the backend rejects excess requests without rotating or revoking the Session

#### Scenario: Refresh is subject to both limits
- **WHEN** a refresh request exceeds either the source-IP limit or the verified-Session limit
- **THEN** the backend returns HTTP 429 and does not perform refresh-token mutation

### Requirement: Sanitized authentication failures
Authentication and authorization failures SHALL use stable error identifiers and SHALL NOT reveal whether a User, Account, Session, provider subject, token hash, or signing key exists.

#### Scenario: Invalid credential is rejected
- **WHEN** token verification, Session validation, or authorization fails
- **THEN** the client receives a sanitized error suitable for handling without sensitive internal details
