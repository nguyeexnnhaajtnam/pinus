## Purpose

Provide Flutter with secure token persistence and deterministic authenticated-request behavior independent of any concrete login provider or login UI.

## ADDED Requirements

### Requirement: Tokens use secure platform storage
The mobile application SHALL persist access and refresh tokens only through a secure token-storage abstraction backed by Android and iOS secure platform storage and SHALL NOT place tokens in ordinary preferences, logs, or error messages.

#### Scenario: Token pair is saved and restored
- **WHEN** the authentication foundation stores a newly issued token pair and the application restarts
- **THEN** authentication state can restore the pair through the secure-storage abstraction without exposing plaintext tokens outside that boundary

#### Scenario: Tokens are cleared
- **WHEN** authentication state signs out or determines refresh has failed permanently
- **THEN** both tokens are removed from secure storage and memory-visible authenticated state

### Requirement: Authentication state reflects stored credentials
The application SHALL expose explicit initializing, unauthenticated, authenticated, and refresh-failure transitions based on secure-storage and token lifecycle outcomes without requiring a login screen.

#### Scenario: Application starts without stored tokens
- **WHEN** secure storage contains no complete token pair
- **THEN** authentication initialization completes in the unauthenticated state

#### Scenario: Application starts with stored tokens
- **WHEN** secure storage returns a complete token pair
- **THEN** authentication state makes the credentials available to the authenticated HTTP client and treats server verification outcomes as authoritative

### Requirement: Authenticated requests attach access tokens
The authenticated HTTP client SHALL attach the current access token as a bearer credential to protected requests and SHALL avoid attaching it to configured public authentication endpoints.

#### Scenario: Protected request is sent
- **WHEN** authenticated state has an access token and a protected request is issued
- **THEN** the client sends exactly that token in the Authorization header without logging it

### Requirement: Refresh is single-flight
The mobile application SHALL allow at most one refresh operation to be in flight for a shared expired credential, and requests encountering the same authorization failure SHALL await the same refresh result.

#### Scenario: Multiple requests receive authorization failures together
- **WHEN** concurrent protected requests fail because the shared access token requires refresh
- **THEN** the client sends one refresh request and all eligible original requests await its result

### Requirement: Original request retries once after refresh
After a successful refresh, the client SHALL persist the new token pair before retrying each eligible original request once with the new access token, and SHALL NOT enter an unbounded refresh or retry loop.

#### Scenario: Refresh succeeds
- **WHEN** a protected request receives the configured authorization failure and the shared refresh operation succeeds
- **THEN** the client stores the rotated pair and retries the original request once with the new access token

#### Scenario: Retried request is unauthorized
- **WHEN** the once-retried request is also rejected as unauthorized
- **THEN** the client returns the failure without attempting another refresh for that request

### Requirement: Permanent refresh failure clears authentication
The client SHALL distinguish retryable transport failures from permanent refresh rejection and SHALL clear local authentication state and secure tokens when the backend permanently rejects the refresh credential.

#### Scenario: Backend rejects refresh token
- **WHEN** refresh fails because the token is expired, revoked, reused, malformed, or otherwise permanently unauthorized
- **THEN** the application clears local tokens, becomes unauthenticated, and fails all requests awaiting that refresh without retrying them with stale credentials

#### Scenario: Temporary network failure interrupts refresh
- **WHEN** refresh cannot complete because of a retryable transport failure
- **THEN** the client does not overwrite the stored token pair and reports a retryable failure without falsely treating refresh as successful

### Requirement: Sign-out updates server and local state
The mobile foundation SHALL support current-session and all-other-session sign-out calls and SHALL clear local credentials only when the current Session is signed out or is known to be invalid.

#### Scenario: Current-session sign-out completes
- **WHEN** the current-session sign-out request succeeds or the backend reports that the current Session is already invalid
- **THEN** the application removes the local token pair and becomes unauthenticated

#### Scenario: Other-session sign-out completes
- **WHEN** the all-other-sessions sign-out request succeeds
- **THEN** the application keeps the current token pair and authenticated state
