# Pinus Decision Policy

## 1. Purpose

This document defines which decisions belong to the product owner and which decisions AI may make autonomously during the Pinus project.

The purpose is to:

- Preserve owner control over product direction.
- Prevent AI from changing business rules without approval.
- Avoid unnecessary approval requests for routine implementation details.
- Make important decisions traceable.
- Reduce accidental scope expansion.
- Prevent hidden privacy, security, cost, and data-ownership changes.

---

## 2. Decision Levels

Every decision belongs to one of three levels:

1. **Owner Decision**
2. **AI Recommendation, Owner Approval**
3. **AI Autonomous Decision**

When classification is unclear, the decision must be treated as **AI Recommendation, Owner Approval**.

---

# 3. Owner Decision

AI must not make the final decision for items in this category.

AI may:

- Analyze the problem.
- Identify assumptions.
- Present alternatives.
- Explain benefits and risks.
- Estimate migration cost.
- Recommend an option.
- Wait for explicit owner approval.

## 3.1 Product Decisions

The owner decides:

- Product vision.
- Product positioning.
- Target audience.
- MVP scope.
- Non-MVP scope.
- Feature priority.
- Initial Pin types.
- Public launch criteria.
- Beta scope.
- Monetization.
- Subscription model.
- Free-tier limits.
- Storage limits.
- Supported markets.
- Supported languages.
- Branding.
- Main navigation.
- Core user journey.
- Major onboarding changes.

## 3.2 Business Rules

The owner decides:

- Maximum active couples per user.
- Invitation expiration.
- Who may edit a Pin.
- Who may delete a Pin.
- Whether partners may edit each other's content.
- Whether a Pin may exist without a location.
- Behavior after couple unlink.
- Recovery period after unlink.
- Visibility of old Pins after unlink.
- Export rights.
- Account deletion behavior.
- Content ownership.
- Media ownership.
- Whether deleted content is recoverable.
- Whether Secret Pins may be unlocked early.
- Whether Time Capsules may be edited after creation.

## 3.3 Privacy Decisions

The owner decides:

- Whether location history is stored.
- Whether background location is used.
- Whether Secret Pin location checks are logged.
- Location precision.
- Data retention periods.
- Media retention periods.
- Data behavior after unlink.
- Data behavior after account deletion.
- Whether location data is used for analytics.
- Whether content is encrypted at the application layer.
- Whether end-to-end encryption is required.
- Whether analytics requires explicit consent.
- Whether third-party SDKs receive personal data.

## 3.4 Security Decisions

The owner decides:

- Authentication strategy.
- Supported identity providers.
- End-to-end encryption.
- Account recovery policy.
- Session revocation policy.
- Device trust requirements.
- Fake-GPS protection requirements.
- Device attestation requirements.
- Data export security.
- Security requirements that materially affect user experience.
- Security requirements that materially affect project cost.

## 3.5 Important Technical Decisions

The owner decides:

- Map provider.
- Authentication provider.
- Hosting provider.
- Database provider.
- Object-storage provider.
- Analytics provider.
- Monitoring provider.
- Deployment region.
- Major dependencies.
- Redis adoption.
- Offline-first support.
- Microservice adoption.
- Breaking public API changes.
- Destructive migrations.
- Major database model changes.
- Vendor-specific architecture.
- Platform expansion.

## 3.6 Cost and Vendor Decisions

The owner must approve:

- New recurring costs.
- Paid third-party services.
- Vendor lock-in with material migration cost.
- Infrastructure migration.
- Pricing-plan upgrades.
- Paid SDK adoption.
- New production environments.
- Long-term storage commitments.

---

# 4. AI Recommendation, Owner Approval

AI may recommend a default option but must not implement it before owner approval.

This category applies when a decision has meaningful long-term impact but is not exclusively a product or business decision.

## 4.1 Typical Decisions in This Category

- Main database schema.
- Access-token lifetime.
- Refresh-token lifetime.
- Refresh-token rotation.
- Session schema.
- Device schema.
- API versioning.
- Folder architecture.
- State-management library.
- Local database.
- Media upload architecture.
- Object-key format.
- Signed-URL lifetime.
- Notification architecture.
- WebSocket event format.
- Soft-delete strategy.
- Audit-log strategy.
- Backup strategy.
- Monitoring strategy.
- CI/CD pipeline structure.
- Branching strategy.
- Environment strategy.
- Major index strategy.
- Retry policy.
- Rate-limit policy.
- Orphan-media cleanup strategy.
- Pagination strategy.
- Cache strategy.
- Background-job adoption.

## 4.2 Required Recommendation Format

AI must use the following format:

```text
Decision:
Context:
Assumptions:
Recommended option:
Alternatives:
Benefits:
Risks:
Security impact:
Privacy impact:
Cost impact:
Migration cost:
Recommendation:
Owner approval:
```

## 4.3 Example

```text
Decision:
Select the map provider.

Context:
Pinus requires map display, markers, geocoding, location search, and spatial interaction.

Assumptions:
The initial market is Vietnam.
The application is Flutter-based.
The MVP prioritizes implementation speed over advanced custom map styling.

Recommended option:
Google Maps.

Alternatives:
Mapbox.
HERE Maps.

Benefits:
Common Flutter integration.
Strong location coverage.
Lower initial implementation complexity.

Risks:
Usage-based cost.
Vendor lock-in.
Migration cost across several screens and services.

Security impact:
Low.

Privacy impact:
Location requests may be processed by a third-party provider.

Cost impact:
Variable usage cost.

Migration cost:
Medium to high.

Recommendation:
Use Google Maps for the MVP.

Owner approval:
Pending.
```

## 4.4 Approval States

Use one of the following:

- `Pending`
- `Approved`
- `Rejected`
- `Deferred`
- `Superseded`

AI must not treat silence as approval.

---

# 5. AI Autonomous Decision

AI may make an autonomous decision only when all of the following conditions are true:

- The decision does not change product behavior.
- The decision does not change a business rule.
- The decision does not change data ownership.
- The decision does not change privacy behavior.
- The decision does not materially change security behavior.
- The decision does not create data-loss risk.
- The decision does not create a meaningful recurring cost.
- The decision does not create major vendor lock-in.
- The decision is easy to reverse.
- The decision follows approved project conventions.
- The decision remains inside the active OpenSpec change.

## 5.1 Code Decisions

AI may decide:

- Variable names.
- Function names.
- Class names.
- File names consistent with conventions.
- Extracting functions.
- Creating small reusable utilities.
- Import ordering.
- Code formatting.
- Lint fixes.
- Null handling.
- Type safety improvements.
- Internal abstractions.
- Removal of clearly unused code.
- Refactoring that preserves behavior.

## 5.2 User Interface Implementation

AI may decide:

- Loading states.
- Empty states.
- Error states.
- Skeleton loading.
- Standard validation messages.
- Retry buttons.
- Common debounce behavior.
- Common throttle behavior.
- Responsive spacing.
- Basic accessibility.
- Keyboard handling.
- Focus management.
- Broken-image fallback.
- Standard confirmation dialogs for reversible actions.

AI must not autonomously change the main navigation, primary visual direction, major user flow, or destructive-action policy.

## 5.3 Backend Implementation

AI may decide:

- DTO validation.
- Internal exception mapping.
- Structured logging fields.
- Transactions for multi-step writes.
- Foreign-key indexes.
- Idempotency for duplicate-prone requests.
- Pagination implementation after strategy approval.
- API documentation.
- Standard security headers.
- MIME validation.
- File-size validation.
- Standard request correlation IDs.
- Retry behavior for temporary internal failures.
- Internal repository implementation.
- Standard health checks.

## 5.4 Testing

AI may create:

- Unit tests.
- Integration tests.
- Authorization tests.
- Race-condition tests.
- Edge-case tests.
- Fixtures.
- Mocks.
- Seed data.
- Test helpers.
- Contract tests.
- Regression tests for confirmed bugs.

AI must not alter expected business behavior merely to make a failing test pass.

## 5.5 Documentation

AI may create or update:

- README files.
- Setup instructions.
- Swagger descriptions.
- Environment examples.
- Necessary code comments.
- Release checklists.
- Test checklists.
- Troubleshooting notes.
- Migration verification notes.
- Autonomous decision reports.

---

# 6. Mandatory Approval Conditions

AI must stop and request owner approval before:

- Changing an approved requirement.
- Changing a business rule.
- Adding a feature outside the active scope.
- Adding a major dependency.
- Changing a major database schema.
- Creating a destructive migration.
- Changing authentication behavior.
- Changing authorization behavior.
- Changing privacy behavior.
- Changing data ownership.
- Changing the security model.
- Changing hosting or infrastructure provider.
- Adding recurring cost.
- Creating meaningful vendor lock-in.
- Making a breaking public API change.
- Deleting or permanently transforming user data.
- Changing the main user flow.
- Changing navigation structure.
- Changing a decision already marked approved.
- Introducing background location.
- Introducing user tracking.
- Sending user data to a new third party.
- Introducing E2EE or removing encryption.
- Introducing microservices.
- Introducing Kubernetes.
- Introducing Redis without an approved use case.
- Increasing scope to prepare for hypothetical scale.

---

# 7. Autonomous Decision Report

After making a notable autonomous implementation decision, AI must record:

```text
Autonomous decision:
Reason:
Assumptions:
Files affected:
Behavior changed:
Security impact:
Privacy impact:
Cost impact:
Risk:
Reversible:
```

## Example

```text
Autonomous decision:
Wrap invitation acceptance in a database transaction.

Reason:
The operation updates multiple records and must remain consistent if one write fails.

Assumptions:
A user may belong to only one active couple.
The invitation becomes consumed after acceptance.

Files affected:
- couple-invitation.service.ts
- couple-invitation.integration.spec.ts

Behavior changed:
No product behavior changed.

Security impact:
None.

Privacy impact:
None.

Cost impact:
None.

Risk:
Low.

Reversible:
Yes.
```

Autonomous reports may be placed in:

```text
docs/decisions/autonomous/
```

or included in the active OpenSpec change documentation.

---

# 8. Decision Log

Important decisions must be stored under:

```text
docs/decisions/
```

Recommended file naming:

```text
DEC-001-map-provider.md
DEC-002-authentication-strategy.md
DEC-003-couple-data-after-unlink.md
DEC-004-object-storage-provider.md
```

## Decision Record Template

```md
# DEC-XXX: Decision Title

## Status

Proposed | Approved | Rejected | Deferred | Superseded

## Date

YYYY-MM-DD

## Owner

Product Owner

## Context

Describe the decision that must be made.

## Assumptions

List assumptions that materially affect the decision.

## Options

### Option A

Description.

### Option B

Description.

## Selected Option

The selected option.

## Reason

Why the option was selected.

## Benefits

Expected benefits.

## Risks

Known risks.

## Security Impact

Describe the security impact.

## Privacy Impact

Describe the privacy impact.

## Cost Impact

Describe one-time and recurring cost.

## Migration Cost

Low | Medium | High

## Revisit Condition

Define when this decision should be reconsidered.
```

---

# 9. Decision Precedence

When instructions or documents conflict, use the following precedence:

1. Explicit current owner instruction.
2. Approved decision record.
3. Active OpenSpec change.
4. Current OpenSpec main specs.
5. Product proposal.
6. Product roadmap.
7. AI recommendation.
8. Historical or archived draft material.

AI must not silently choose an interpretation when the conflict affects:

- Business rules.
- Privacy.
- Security.
- Data ownership.
- Cost.
- Destructive behavior.
- Public API behavior.

In those cases, AI must identify the conflict and request owner approval.

---

# 10. Scope Control

Every active OpenSpec change must implement only its declared scope.

AI must not:

- Add adjacent features without approval.
- Refactor unrelated modules unless required to complete the active change.
- Introduce abstractions for hypothetical future requirements.
- Add infrastructure for unproven scale.
- Replace an approved dependency without approval.
- Modify an unrelated business rule.
- Expand an MVP change into post-MVP work.
- Hide scope changes inside refactoring.

## Out-of-Scope Finding Format

When AI identifies useful work outside the active scope, it must record:

```text
Follow-up candidate:
Reason:
Impact:
Suggested future OpenSpec change:
Urgency:
```

Example:

```text
Follow-up candidate:
Add thumbnail generation for uploaded images.

Reason:
Original images may be too large for efficient timeline rendering.

Impact:
Performance and bandwidth.

Suggested future OpenSpec change:
add-image-thumbnail-processing

Urgency:
Medium.
```

---

# 11. Database and Migration Rules

AI may create non-destructive migrations when they are inside an approved change and follow an approved schema.

AI must request approval for:

- Dropping a table.
- Dropping a column.
- Changing a column type with conversion risk.
- Removing an index required by existing behavior.
- Rewriting large volumes of production data.
- Changing ownership semantics.
- Making nullable data required without a migration plan.
- Deleting historical records.
- Changing geographic precision.
- Changing encryption format.
- Changing primary identifiers.

Every production migration must include:

- Expected effect.
- Rollback strategy.
- Data-risk assessment.
- Verification query or test.
- Downtime expectation.
- Owner approval when destructive or hard to reverse.

---

# 12. Dependency Rules

AI may add a small dependency without approval only when:

- It is widely used and maintained.
- It solves a clearly active requirement.
- It has low migration cost.
- It does not introduce a new external service.
- It does not materially affect bundle size, cost, privacy, or security.
- Equivalent functionality is not already present.

AI must request approval when a dependency:

- Adds a paid service.
- Adds a new vendor.
- Sends data to a third party.
- Requires native platform permissions.
- Introduces code generation across the project.
- Introduces a new architectural pattern.
- Has significant bundle-size impact.
- Has uncertain maintenance.
- Has high migration cost.
- Replaces an approved core library.

---

# 13. Security and Privacy Default Rules

Unless an owner-approved decision says otherwise:

- Storage buckets are private.
- Sensitive tokens are not stored in plain application storage.
- Refresh tokens are hashed before database storage.
- Authorization is enforced on the backend.
- Client-provided ownership claims are not trusted.
- Client time is not trusted for Time Capsule unlock.
- Client distance claims are not trusted for Secret Pin unlock.
- Locked content is not sent to the client.
- Logs must not contain access tokens, refresh tokens, passwords, or private Pin content.
- Location data collection must be limited to the active feature.
- Continuous background location is disabled.
- Third-party data sharing is minimized.
- Account deletion behavior must be explicit and testable.

These defaults do not authorize AI to make broader privacy or security product decisions.

---

# 14. AI Implementation Report

For each completed OpenSpec change, AI should summarize:

```text
Change:
Implemented scope:
Owner-approved decisions used:
Autonomous decisions:
Tests added:
Security considerations:
Privacy considerations:
Known limitations:
Follow-up candidates:
```

This report may be placed in the change documentation or pull-request description.

---

# 15. Conflict Resolution Process

When a conflict appears:

1. Identify the conflicting sources.
2. Explain the practical impact.
3. Determine whether the conflict affects product, privacy, security, cost, or data.
4. If impact is low and implementation-only, follow the highest-precedence source.
5. If impact is material, stop and request owner approval.
6. Record the final decision if it changes an existing approved direction.

AI must not resolve a material conflict by guessing the owner's intention.

---

# 16. Core Principle

The owner decides:

- What the product does.
- Who the product serves.
- Who owns the data.
- How privacy works.
- Which costs are acceptable.
- Which high-impact or hard-to-reverse technical choices are approved.

AI decides:

- How routine implementation details are written.
- How standard validation is applied.
- How common UI states are handled.
- How tests and documentation are organized.
- How safe, reversible, and low-impact technical details are implemented.
