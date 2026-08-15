## MODIFIED Requirements

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

## ADDED Requirements

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
