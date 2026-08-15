# identity-session-domain Specification

## Purpose

Define the persistent identity, external-account linkage, and bounded multi-device session contract that future authentication providers will use.

## Requirements

### Requirement: User identity is independent of email
The system SHALL represent a person with a stable User identifier and SHALL NOT use email alone as the primary or unique proof of that identity.

#### Scenario: Users share or change an email value
- **WHEN** two external accounts report the same email or an account reports a changed email
- **THEN** the system identifies users through approved account linkage rules rather than merging or selecting a User by email alone

#### Scenario: Provider supplies no email
- **WHEN** a verified provider identity has no email value
- **THEN** the identity model can represent the linked Account without inventing an email

### Requirement: External account identity is provider-scoped
The system SHALL represent an external identity as an Account linked to one User, SHALL uniquely identify that Account by the combination of provider and provider subject, and SHALL reuse the linked User and Account when that verified provider identity authenticates again.

#### Scenario: Same subject exists at different providers
- **WHEN** two verified identities have the same subject string but different providers
- **THEN** the system treats them as distinct Accounts

#### Scenario: Provider identity is linked twice
- **WHEN** an attempt is made to link a provider-and-subject pair that already exists
- **THEN** the system rejects the duplicate linkage without creating another User or Account

#### Scenario: Known provider identity authenticates again
- **WHEN** a backend-verified provider-and-subject pair already belongs to an Account
- **THEN** the system reuses that Account and its existing User without creating another identity record

### Requirement: First verified social login creates identity atomically
The system SHALL create exactly one new User and one linked Account when a backend-verified Google or Apple provider-and-subject pair is first authenticated, and SHALL treat provider email as optional non-identifying profile information.

#### Scenario: New verified identity includes email
- **WHEN** a verified provider-and-subject pair is unknown and the provider supplies an email
- **THEN** the system atomically creates a User and linked Account while storing the email only as optional informational data

#### Scenario: New verified identity omits email
- **WHEN** a verified provider-and-subject pair is unknown and the provider supplies no email
- **THEN** the system atomically creates a User and linked Account without inventing or requiring an email

#### Scenario: Another identity reports the same email
- **WHEN** an unknown verified provider identity reports an email already present on another Account
- **THEN** the system creates a distinct User and Account and does not automatically merge or link identities by email

### Requirement: Concurrent first login is idempotent
The system MUST serialize or reconcile concurrent first-login attempts for the same verified provider-and-subject pair so they resolve to one Account and one User without orphaned identity records.

#### Scenario: Same new identity authenticates concurrently
- **WHEN** multiple valid authentication requests for the same previously unknown provider-and-subject pair execute concurrently
- **THEN** exactly one User and Account are created and every successful request creates its Session for that same User

### Requirement: Identity creation requires backend-verified provider evidence
The session foundation SHALL accept external identity claims only from a trusted backend provider-verification boundary and SHALL NOT create or select a User from provider identity fields asserted directly by the mobile client.

#### Scenario: Client submits unverified provider identity fields
- **WHEN** a client supplies a provider, subject, email, or User identifier without backend-verified provider evidence
- **THEN** the system does not create an identity or authenticated session from those fields

### Requirement: Sessions represent independently revocable devices
The system SHALL represent each authenticated device session independently with its owning User, refresh-token state, creation and expiry timestamps, and revocation state.

#### Scenario: User authenticates on multiple devices
- **WHEN** a User has multiple valid device sessions below the approved limit
- **THEN** revoking or rotating one Session does not mutate the token state of the other Sessions

### Requirement: Maximum active session limit
The system SHALL permit at most five active Sessions per User and SHALL atomically revoke the oldest active Session when creating a sixth Session.

#### Scenario: Sixth active session is requested
- **WHEN** a User already has five non-expired, non-revoked Sessions and a trusted authentication flow requests another
- **THEN** the system revokes the oldest active Session and creates the new Session without exceeding five active Sessions

#### Scenario: Oldest active session is selected deterministically
- **WHEN** more than one active Session could be considered oldest
- **THEN** the system orders by creation time and a stable Session identifier tie-breaker so concurrent operations select deterministically

#### Scenario: Expired or revoked sessions exist
- **WHEN** a User has fewer than five active Sessions after expired and revoked Sessions are excluded
- **THEN** the system can create a new Session without counting the inactive records toward the limit

### Requirement: Session mutations are consistent
The system MUST apply session creation, token rotation, and revocation changes atomically wherever concurrent operations could otherwise violate the five-session limit or produce multiple valid refresh-token states.

#### Scenario: Concurrent session creation reaches the limit
- **WHEN** concurrent trusted authentication operations would create more than five active Sessions for one User
- **THEN** at most five Sessions remain active, each successful creation applies its required oldest-Session revocation atomically, and no operation leaves partial identity or token state
