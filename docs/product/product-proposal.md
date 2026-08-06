# Pinus Product and Development Proposal

## 1. Document Purpose

This document defines the product direction, MVP scope, delivery phases, technical assumptions, and development approach for Pinus.

Pinus is being built from scratch. No existing mobile application, backend service, database schema, authentication system, deployment environment, or production infrastructure is assumed.

This document is the primary product-level reference for the project. Detailed implementation work should be split into separate OpenSpec changes.

---

## 2. Product Overview

Pinus is a private mobile application for couples.

It allows two people to build a shared map of memories, plans, and private moments. Each item is represented as a Pin associated with a location, time, content, and interaction between the couple.

### Core Pin Types

- **Memory Pin**: A memory that has already happened.
- **Plan Pin**: A place or activity the couple wants to experience.
- **Secret Pin**: A Pin that unlocks only when a location condition is met.
- **Time Capsule**: A Pin that unlocks only at a specified date and time.
- **Question Pin**: A question, prompt, or challenge for the partner.

### Core Product Value

Pinus combines:

> Location + time + private content + interaction between two people.

Pinus is not intended to replace chat applications or public social networks. Its core value is to provide a private space where a couple can build, revisit, and preserve the history of their relationship.

---

## 3. Product Goals

The MVP must test the following assumptions:

1. Users want to save meaningful memories based on location.
2. Users are willing to invite their partner into a shared private space.
3. Connected couples create more than one Pin.
4. Users return to revisit old Pins or browse the relationship timeline.
5. Secret Pins and Time Capsules provide enough differentiation to improve engagement.

### Primary Metrics

- Invitation creation rate.
- Invitation acceptance rate.
- Couple activation rate.
- Average number of Pins per couple.
- Percentage of couples with at least three Pins.
- Day 1 retention.
- Day 7 retention.
- Percentage of users who revisit an existing Pin.
- Secret Pin unlock rate.
- Time Capsule unlock rate.

---

## 4. Project Assumptions

### 4.1 Development Assumptions

This proposal assumes:

- The project is built completely from scratch.
- There is no existing Flutter application.
- There is no existing NestJS backend.
- There is no existing database schema.
- There is no existing authentication implementation.
- There is no existing deployment pipeline.
- One primary developer is responsible for mobile and backend development.
- AI is used to assist with planning, implementation, testing, and documentation.
- The developer remains responsible for reviewing and approving important decisions.
- Android and iOS are the initial supported platforms.
- A web application is not included in the MVP.
- The backend is implemented as a modular monolith.
- Microservices are not introduced in the MVP.
- Continuous background location tracking is not included.
- Chat, voice call, and video call are not included.
- The MVP supports images but not complex video processing.
- The first release is a closed beta rather than a public launch.

### 4.2 Timeline Assumptions

Estimated timeline for one developer:

- Technical MVP with core flows: approximately 10 to 12 weeks.
- Beta-ready MVP with testing, analytics, and release preparation: approximately 12 to 16 weeks.
- Part-time development: approximately 4 to 6 months.

The timeline may change based on:

- Actual development hours per week.
- UI quality expectations.
- App Store and Google Play review requirements.
- Social login complexity.
- Number of devices and operating system versions tested.
- Secret Pin anti-spoofing requirements.
- Privacy and encryption requirements.
- Infrastructure provider decisions.

---

## 5. Decision Ownership Model

All decisions are divided into three levels.

### 5.1 Owner Decision

The owner must make the final decision.

AI may analyze options, identify trade-offs, recommend an option, and prepare supporting material, but must not make the final decision.

Owner decisions include:

- Product direction.
- Target audience.
- MVP scope.
- Monetization.
- Privacy policy.
- Data ownership.
- Data retention.
- Security model.
- End-to-end encryption.
- Authentication strategy.
- Infrastructure provider.
- Map provider.
- Storage provider.
- Destructive migrations.
- Breaking public API changes.
- Major dependencies.
- Recurring costs.
- Vendor lock-in.
- Important business rules.
- Core user flows.

### 5.2 AI Recommendation, Owner Approval

AI may provide a default recommendation but must wait for approval before implementation.

Examples include:

- Main database schema.
- Token lifetime.
- Refresh token strategy.
- State management.
- Local database.
- API versioning.
- Media upload architecture.
- Notification architecture.
- Soft-delete strategy.
- Backup strategy.
- Monitoring strategy.
- CI/CD structure.
- Branching strategy.
- Retry policy.
- Rate-limit policy.
- Major index strategy.

### 5.3 AI Autonomous Decision

AI may decide implementation details when the decision:

- Does not change product behavior.
- Does not change a business rule.
- Does not create data-loss risk.
- Does not materially increase cost.
- Is easy to reverse.
- Follows approved project conventions.

Examples include:

- Variable and function names.
- Code formatting.
- Import organization.
- Basic DTO validation.
- Null handling.
- Loading, empty, and error states.
- Unit and integration tests.
- Test fixtures and seeds.
- Standard logging.
- Swagger documentation.
- Safe internal refactoring.
- Foreign-key indexes.
- Transactions for multi-step writes.
- Idempotency for duplicate-prone requests.
- Basic accessibility.
- Common debounce and retry behavior.

The complete policy is defined in `docs/product/decision-policy.md`.

---

## 6. Recommended Technology Stack

### 6.1 Mobile

- Flutter.
- Riverpod.
- GoRouter.
- Dio.
- Freezed.
- JsonSerializable.
- Flutter Secure Storage.
- Drift or SQLite.
- Google Maps Flutter or another owner-approved map provider.
- Firebase Cloud Messaging.
- Sentry or Firebase Crashlytics.

### 6.2 Backend

- NestJS.
- Prisma.
- PostgreSQL.
- PostGIS.
- REST API.
- WebSocket Gateway.
- Swagger/OpenAPI.
- Pino structured logging.

### 6.3 Storage and Infrastructure

- AWS S3, Cloudflare R2, or another owner-approved S3-compatible provider.
- Private buckets.
- Presigned upload URLs.
- Signed download URLs.
- Docker.
- GitHub Actions.
- Managed PostgreSQL.
- Separate development, staging, and production environments.

### 6.4 Async Processing

- Redis is not required for the first implementation unless a concrete use case requires it.
- Redis and BullMQ may be introduced later for:
  - Scheduled jobs.
  - Media processing.
  - Notification retries.
  - Thumbnail generation.
  - Video recap generation.
  - Distributed rate limiting.

---

## 7. High-Level Architecture

```text
Flutter Mobile Application
        |
        |-- REST API
        |-- WebSocket
        |-- Push Notifications
        |-- Direct Media Upload
        |
        v
NestJS Modular Monolith
        |
        |-- PostgreSQL
        |-- PostGIS
        |-- Object Storage
        |-- Notification Provider
```

### Architectural Principles

- Start with a modular monolith.
- Keep modules independent through clear boundaries.
- Do not introduce microservices without a demonstrated need.
- Prefer simple and reversible designs.
- Keep storage private by default.
- Validate authorization at the backend.
- Do not trust location, time, or ownership claims from the client.
- Keep product behavior separate from implementation details.
- Do not add infrastructure for hypothetical scale.

---

## 8. Phase 0: Product Definition

### Goal

Define the product before implementation begins.

### Estimated Duration

3 to 5 working days.

### Tasks

- Define the target audience.
- Confirm the temporary or final product name.
- Define the value proposition.
- Confirm the MVP scope.
- Define the non-MVP scope.
- Create the primary user journey.
- Define the first set of screens.
- Define success metrics.
- Define privacy principles.
- Define data ownership.
- Define data behavior after couple unlink.
- Define account deletion expectations.
- Create the initial product backlog.

### Owner Decisions

- Target audience.
- MVP features.
- Initial Pin types.
- Authentication methods.
- Data handling after unlink.
- Data handling after account deletion.
- Branding direction.
- Initial language and release market.

### AI Autonomous Work

- Organize requirements.
- Draft user stories.
- Draft acceptance criteria.
- Detect contradictory requirements.
- Identify edge cases.
- Create an initial backlog.
- Create a requirement traceability matrix.

### Deliverables

- Product proposal.
- Product roadmap.
- Decision policy.
- MVP scope.
- Non-MVP list.
- User journey.
- Initial backlog.
- Decision log.

### Exit Criteria

- All MVP features are defined.
- Important business rules have an owner decision.
- The main flow from sign-in to creating a Pin is documented.
- No unresolved product ambiguity blocks technical setup.

---

## 9. Phase 1: Technical Foundation

### Goal

Create the mobile, backend, database, and development foundation.

### Estimated Duration

1 to 2 weeks.

### Mobile Tasks

- Create the Flutter project.
- Configure development, staging, and production flavors.
- Configure Riverpod.
- Configure GoRouter.
- Configure Dio.
- Configure theme support.
- Configure global error handling.
- Configure secure storage.
- Configure localization foundations.
- Configure crash reporting.

### Backend Tasks

- Create the NestJS project.
- Create the module structure.
- Configure Prisma.
- Configure PostgreSQL.
- Enable PostGIS.
- Configure validation.
- Configure exception handling.
- Configure structured logging.
- Configure Swagger.
- Configure Docker Compose.
- Add a health-check endpoint.

### Infrastructure Tasks

- Create the repository structure.
- Configure branch protection.
- Configure GitHub Actions.
- Configure environment validation.
- Configure local secret handling.
- Create a staging backend environment.
- Create a staging database.

### Owner Approval Required

- Repository strategy.
- Hosting provider.
- Database provider.
- Object storage provider.
- Map provider.
- Monitoring provider.
- Deployment region.
- Major dependencies.

### AI Autonomous Work

- Source-code organization.
- Formatting and linting.
- Local Docker configuration.
- README instructions.
- Health-check implementation.
- CI lint and test jobs.
- Common error response format.
- Environment-variable validation.

### Exit Criteria

- Flutter runs on Android and iOS simulators.
- NestJS runs locally.
- Backend connects to PostgreSQL.
- Prisma migrations work.
- PostGIS is enabled.
- CI passes.
- Staging is reachable.
- Flutter can call the backend health-check endpoint.

---

## 10. Phase 2: Authentication and User Management

### Goal

Allow users to authenticate and manage their sessions.

### Estimated Duration

1 to 2 weeks.

### Features

- Sign in.
- Sign out.
- Token refresh.
- User profile.
- Avatar.
- Device management.
- Session revocation.
- Account deletion request.

### Owner Decisions

- Supported login methods.
- Social login providers.
- Whether email and password are supported.
- Whether verified email is required.
- Account deletion policy.
- Data retention policy.
- Maximum number of active devices.
- Session recovery behavior.

### AI Recommendation, Owner Approval

- Access-token lifetime.
- Refresh-token lifetime.
- Refresh-token rotation.
- Session schema.
- Password hashing strategy.
- Refresh-token hashing.
- Device identification.
- Rate limiting.
- Reuse detection.

### AI Autonomous Work

- DTOs.
- Validation.
- Authentication guards.
- Route protection.
- Standard error responses.
- Unit tests.
- Integration tests.
- Swagger documentation.

### Exit Criteria

- Users can authenticate.
- Private endpoints require valid authentication.
- Sessions are stored securely.
- Users can revoke one or all sessions.
- Refresh-token behavior follows the approved strategy.
- Account deletion flow is defined and testable.

---

## 11. Phase 3: Couple Connection

### Goal

Allow two users to connect as a couple.

### Estimated Duration

1 week.

### Features

- Create an invitation.
- Share an invitation code or deep link.
- View an invitation.
- Accept an invitation.
- Reject an invitation.
- Cancel an invitation.
- View partner profile.
- Unlink a couple.

### Owner Decisions

- Maximum number of active couples per user.
- Invitation expiration time.
- Who may unlink.
- Data behavior after unlink.
- Whether an unlink recovery period exists.
- Whether old Pins remain visible after unlink.
- Whether a former partner can export shared data.

### AI Autonomous Work

- Duplicate-invitation protection.
- Double-acceptance protection.
- Database transactions.
- Idempotency.
- Input validation.
- Race-condition tests.
- Internal domain events.

### Exit Criteria

- Two users can connect successfully.
- A user cannot invite themselves.
- An invitation cannot be used more than once.
- Couple membership follows approved business rules.
- Unlink behavior follows the approved policy.

---

## 12. Phase 4: Shared Map and Pin Core

### Goal

Build the core product experience.

### Estimated Duration

2 to 3 weeks.

### Recommended MVP Pin Types

- Memory Pin.
- Plan Pin.

Secret Pin and Time Capsule may be deferred until the core flow is stable.

### Features

- Shared map.
- Current location.
- Pin markers.
- Create Pin.
- Select location.
- Search location.
- Edit Pin.
- Delete Pin.
- Pin detail.
- Query Pins within map bounds.
- Query nearby Pins.

### Owner Decisions

- Map provider.
- Fields required for each Pin type.
- Who may edit a Pin.
- Who may delete a Pin.
- Whether partners may edit each other's Pins.
- Whether Pins may exist without a location.
- Whether exact or approximate location is shown.
- Whether author information is displayed.
- User-visible delete behavior.

### AI Recommendation, Owner Approval

- Pin database schema.
- PostGIS data type.
- Map-bounds API design.
- Nearby-query design.
- Index strategy.
- Soft-delete strategy.
- Pagination strategy.

### AI Autonomous Work

- Marker state management.
- Loading state.
- Empty state.
- Form validation.
- API client implementation.
- Repository implementation.
- Permission checks.
- PostGIS indexes.
- CRUD tests.

### Exit Criteria

- A user can create a Pin.
- The partner can view the Pin.
- The marker appears at the correct location.
- Cross-couple access is blocked.
- Edit and delete behavior follows approved permissions.
- Map queries remain bounded and paginated where appropriate.

---

## 13. Phase 5: Media and Timeline

### Goal

Allow Pins to contain images and be revisited chronologically.

### Estimated Duration

1 to 2 weeks.

### Features

- Upload images.
- Attach multiple images to a Pin.
- Reorder images.
- Delete images.
- View a relationship timeline.
- Group timeline items by month or year.
- Filter by Pin type.
- Open Pin detail from the timeline.

### Owner Decisions

- Maximum images per Pin.
- Maximum upload size.
- Image-quality policy.
- Whether original images are retained.
- Whether the client compresses images.
- Object-storage provider.
- Media retention policy.
- Media deletion permissions.

### AI Recommendation, Owner Approval

- Presigned-upload flow.
- Object-key format.
- Thumbnail strategy.
- Signed-URL lifetime.
- Media metadata schema.
- Orphan-file cleanup strategy.

### AI Autonomous Work

- MIME validation.
- File-size validation.
- Upload retry.
- Upload progress.
- Failed-upload cleanup.
- Timeline pagination.
- Image caching.
- Broken-image fallback.

### Exit Criteria

- Images upload directly to object storage.
- Storage is private.
- Users cannot attach media to another couple's Pin.
- Timeline ordering is correct.
- Broken media does not crash the application.
- Orphan-file handling is documented.

---

## 14. Phase 6: Notifications and Realtime Updates

### Goal

Synchronize important activity between partners.

### Estimated Duration

1 week.

### Features

- Push notifications.
- WebSocket updates.
- Notification deep links.
- Device-token management.
- Notification preferences.

### Owner Decisions

- Events that trigger push notifications.
- Whether edits trigger notifications.
- Whether Plan Pins generate reminders.
- Notification categories users may disable.
- Whether email notifications are supported.

### AI Recommendation, Owner Approval

- WebSocket event format.
- Push retry strategy.
- Token invalidation strategy.
- Foreground notification behavior.
- Duplicate-suppression strategy.

### AI Autonomous Work

- Device-token refresh.
- WebSocket reconnect.
- Deep-link routing.
- Self-notification prevention.
- Standard notification payloads.
- Retry for temporary failures.

### Exit Criteria

- The partner receives push notifications in the background.
- The app receives realtime updates while open.
- Notification taps open the correct screen.
- Common duplicate notifications are prevented.
- Invalid device tokens are removed.

---

## 15. Phase 7: Secret Pin and Time Capsule

### Goal

Add differentiated location- and time-based experiences.

### Estimated Duration

1 to 2 weeks.

### Secret Pin Features

- Lock content by location.
- Configure unlock radius.
- Perform a manual location check.
- Record unlock status.
- Optionally record unlock history.

### Time Capsule Features

- Lock content by time.
- Validate unlock time on the server.
- Support time zones.
- Optionally schedule reminders.

### Owner Decisions

- Whether Secret Pin belongs in the MVP.
- Minimum and maximum unlock radius.
- Whether fake-GPS resistance is required.
- Whether location-check history is stored.
- Whether the creator may unlock early.
- Whether unlock time may be edited.
- Whether reminder notifications are sent.
- Whether unlocked content may be locked again.

### AI Autonomous Work

- PostGIS distance checks.
- Server-time validation.
- Locked-content filtering.
- Time-zone conversion.
- Error handling.
- Unit and integration tests.

### Exit Criteria

- Locked content is not returned before unlock.
- Secret Pin unlock follows the approved radius.
- Time Capsule unlock follows server time.
- Time-zone edge cases are tested.
- Location data is handled according to the approved privacy policy.

---

## 16. Phase 8: Production Hardening

### Goal

Prepare the system for a controlled beta.

### Estimated Duration

1 to 2 weeks.

### Security

- Authorization review.
- Rate limiting.
- Refresh-token security.
- Signed media access.
- Input validation.
- Upload validation.
- Secret management.
- Dependency audit.
- Session revocation.
- Account deletion.

### Reliability

- Database backups.
- Migration plan.
- Health checks.
- Structured logging.
- Crash reporting.
- API monitoring.
- Alerting.
- Error tracking.

### Performance

- Pagination.
- Map-bounds queries.
- Database indexes.
- Image caching.
- Lazy loading.
- API response-size controls.

### Owner Decisions

- Backup retention.
- Incident severity definitions.
- Expected service availability.
- Support contact.
- Privacy policy.
- Terms of service.
- App Store privacy declarations.
- Analytics consent behavior.
- Account deletion deadline.

### AI Autonomous Work

- Test cases.
- Security checklist.
- Performance scripts.
- Release checklist.
- Migration verification.
- API contract verification.
- Basic load testing.

### Exit Criteria

- No known critical security issue remains.
- Backup and restore are tested.
- Critical APIs have integration tests.
- Analytics works.
- Crash reporting works.
- Account deletion is tested end to end.
- App Store and Play Store compliance requirements are documented.

---

## 17. Phase 9: Closed Beta

### Goal

Validate real user behavior before public release.

### Estimated Duration

2 to 4 weeks of observation and iteration.

### Scope

- 20 to 50 couples.
- TestFlight.
- Google Play closed testing.
- In-app feedback.
- Analytics dashboard.
- Crash monitoring.

### Owner Decisions

- Beta participants.
- Whether beta is free.
- Beta stop criteria.
- Public-launch criteria.
- Post-beta feature priorities.

### AI Autonomous Work

- Summarize feedback.
- Classify bugs.
- Group feature requests.
- Analyze event data.
- Detect funnel drop-off.
- Draft reproduction steps.
- Recommend issue priority.

### Success Indicators

The MVP has a positive signal when:

- A large share of new users creates an invitation.
- Invitation acceptance is healthy.
- Connected couples create at least one Pin.
- A meaningful percentage creates at least three Pins.
- Users return to revisit old Pins.
- Users create new content without repeated prompting.

These indicators are directional. Final thresholds require real baseline data.

---

## 18. Recommended Sprint Plan

### Sprint 1

- Product definition.
- Repository setup.
- Flutter initialization.
- NestJS initialization.
- PostgreSQL.
- PostGIS.
- CI/CD.
- Environment configuration.

### Sprint 2

- Authentication.
- User profile.
- Session management.
- Device management.

### Sprint 3

- Couple invitation.
- Couple management.
- Deep links.

### Sprint 4

- Shared map.
- PostGIS queries.
- Create Pin.
- Pin detail.

### Sprint 5

- Edit and delete Pin.
- Media upload.
- Timeline.

### Sprint 6

- Push notifications.
- WebSocket.
- Realtime synchronization.

### Sprint 7

- Secret Pin.
- Time Capsule.

### Sprint 8

- Security.
- Testing.
- Performance.
- Analytics.
- Beta release.

Each sprint may last one or two weeks depending on available development capacity.

---

## 19. Final MVP Scope

The target MVP includes:

- Flutter application for Android and iOS.
- Authentication.
- User profile.
- Session and device management.
- Couple invitation.
- Couple management.
- Shared map.
- Memory Pin.
- Plan Pin.
- Image upload.
- Timeline.
- Push notifications.
- Realtime updates.
- Secret Pin.
- Time Capsule.
- Analytics.
- Crash reporting.
- Account deletion.
- Basic privacy controls.

### Not Included in MVP

- Private chat.
- Voice calls.
- Video calls.
- Public social feed.
- Continuous background location tracking.
- AI recommendations.
- Complex video editing.
- Marketplace.
- Advertising.
- Microservices.
- Kubernetes.
- Complex gamification.

---

## 20. OpenSpec Usage

This document is a product-level reference.

It should not be copied into a single OpenSpec change.

Recommended structure:

```text
docs/
  product/
    product-proposal.md
    roadmap.md
    decision-policy.md

openspec/
  config.yaml
  specs/
  changes/
```

Each implementation unit should become a separate OpenSpec change, for example:

```text
openspec/changes/
  initialize-project-foundation/
  implement-authentication/
  add-couple-invitation/
  add-shared-map/
  add-memory-pin/
  add-media-upload/
```

The `openspec/specs/` directory should describe behavior that has already been implemented and archived, not the entire future roadmap.

---

## 21. Final Delivery Flow

```text
Product Definition
        |
        v
Technical Foundation
        |
        v
Authentication
        |
        v
Couple Connection
        |
        v
Shared Map and Pins
        |
        v
Media and Timeline
        |
        v
Notifications and Realtime
        |
        v
Secret Pin and Time Capsule
        |
        v
Production Hardening
        |
        v
Closed Beta
        |
        v
Owner Decision on Public Launch
```

---

## 22. Governing Principle

The owner decides:

- What the product does.
- Who the product is for.
- Who owns the data.
- How privacy works.
- Which costs are acceptable.
- Which high-impact or hard-to-reverse technical choices are approved.

AI decides:

- How routine implementation details are written.
- How standard validation is applied.
- How common UI states are handled.
- How tests and documentation are organized.
- How safe and reversible technical details are implemented.
