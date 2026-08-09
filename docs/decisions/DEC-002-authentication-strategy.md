# DEC-002: Authentication Strategy

## Status

Approved

## Date

2026-08-07

## Owner

Product Owner

## Context

Pinny requires authentication for Android and iOS.

The application is built with Flutter and a NestJS backend. Authentication
must support multiple devices and allow additional identity providers to be
linked in the future.

## Assumptions

- Pinny initially targets Android and iOS.
- The first release is a closed beta.
- The application does not require email/password authentication initially.
- One user may sign in on multiple devices.
- Authentication tokens are issued and managed by the Pinny backend.

## Options

### Option A: Google and Apple Sign-In

Use Google Sign-In and Apple Sign-In as the initial authentication methods.

### Option B: Email and Password

Implement account registration, email verification, password login, password
reset, and credential storage.

### Option C: Managed Authentication Provider

Use a hosted authentication platform to manage identities and sessions.

## Recommended Option

Option A: Google and Apple Sign-In.

## Identity Model

- A User represents the Pinny identity.
- An Account represents an external authentication provider identity.
- A User may have multiple Accounts.
- Provider identity is uniquely identified by provider and provider subject.
- Email is not used as the primary account identifier.
- Email may be nullable.

## Session Strategy

- Access token lifetime: 15 minutes.
- Refresh token lifetime: 30 days.
- Refresh token rotation: enabled.
- Refresh tokens are stored as hashes.
- Multiple active devices are allowed.
- Maximum active sessions per user: 5.
- Users may revoke individual sessions.
- Users may revoke all sessions except the current session.

## Security Requirements

- Provider identity tokens must be verified by the backend.
- The backend must not trust user identity supplied directly by the client.
- Access tokens must be short-lived.
- Refresh tokens must not be stored in plaintext.
- Flutter must store tokens using secure platform storage.
- Authentication failures must not expose sensitive internal details.
- Authentication endpoints must be rate limited.

## Account Deletion

Account deletion is not included in the first authentication change.

It will be handled by a separate OpenSpec change after shared-data ownership
and couple-unlink behavior are approved.

## Benefits

- Low-friction mobile authentication.
- No password storage or password-reset flow.
- Supports both Android and iOS.
- Allows additional identity providers later.
- Supports multiple device sessions.

## Risks

- Requires configuration in Google Cloud and Apple Developer.
- Creates dependency on external identity providers.
- Apple authentication is more difficult to test in simulators.
- Account-linking rules must prevent duplicate users.

## Migration Cost

Medium.

## Revisit Condition

Reconsider when:

- Users request email/password or passwordless email login.
- The application expands to web.
- Social-login provider dependency becomes a product risk.
- Authentication costs or platform requirements materially change.

## Owner Approval

Approved.