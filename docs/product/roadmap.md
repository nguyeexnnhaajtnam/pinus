# Pinus Product Roadmap

## 1. Purpose

This roadmap defines the planned delivery phases for Pinus.

It is a product-level planning document. It tracks phase goals, status, deliverables, dependencies, owner decisions, and completion criteria.

Detailed implementation work should be managed through separate OpenSpec changes.

---

## 2. Project Summary

Pinus is a private shared memory map for couples.

The project is built from scratch with the following intended architecture:

- **Mobile**: Flutter.
- **State management**: Riverpod.
- **Navigation**: GoRouter.
- **Backend**: NestJS modular monolith.
- **Database**: PostgreSQL.
- **Geospatial support**: PostGIS.
- **ORM**: Prisma.
- **Media storage**: Private S3-compatible object storage.
- **Push notifications**: Firebase Cloud Messaging.
- **Realtime updates**: WebSocket.
- **Infrastructure**: Docker and GitHub Actions.

---

## 3. Roadmap Status Values

Use one of the following statuses:

- `Planned`
- `Ready`
- `In Progress`
- `Blocked`
- `In Review`
- `Completed`
- `Deferred`
- `Cancelled`

### Status Definitions

| Status | Meaning |
|---|---|
| Planned | The phase is expected but not yet ready to start. |
| Ready | Scope and required decisions are complete. |
| In Progress | Active implementation is underway. |
| Blocked | Work cannot continue because of an unresolved dependency or decision. |
| In Review | Implementation is complete and waiting for validation. |
| Completed | Exit criteria are met. |
| Deferred | The phase is intentionally postponed. |
| Cancelled | The phase is no longer planned. |

---

## 4. Roadmap Principles

- A phase does not automatically equal one OpenSpec change.
- Large phases should be divided into smaller changes.
- Product decisions must be approved before implementation.
- AI may handle common implementation details according to the decision policy.
- Features outside the active phase should not be added opportunistically.
- A phase is complete only when its exit criteria are met.
- Completed OpenSpec changes should be archived before the next dependent change begins.
- The roadmap should be updated when scope, priority, or status changes.

---

# Phase 0: Product Definition

**Status:** Planned

## Goal

Define the product, MVP, business rules, privacy boundaries, and success metrics before implementation.

## Main Activities

- Define target users.
- Confirm product positioning.
- Confirm MVP scope.
- Define non-MVP scope.
- Define core user journeys.
- Define Pin types.
- Define data ownership.
- Define privacy expectations.
- Define behavior after couple unlink.
- Define account deletion behavior.
- Define success metrics.
- Create the initial backlog.
- Create the decision log.

## Owner Decisions

- Target audience.
- Product name and branding direction.
- MVP features.
- Initial Pin types.
- Initial login methods.
- Initial launch market.
- Supported languages.
- Data behavior after unlink.
- Data behavior after account deletion.
- Whether Secret Pin is included in MVP.
- Whether Time Capsule is included in MVP.

## Deliverables

- `docs/product/product-proposal.md`
- `docs/product/roadmap.md`
- `docs/product/decision-policy.md`
- MVP scope.
- Non-MVP list.
- Core user journey.
- Initial backlog.
- Initial decision log.

## Dependencies

None.

## Exit Criteria

- MVP scope is approved.
- Non-MVP scope is documented.
- Core user flow is documented.
- Important business rules are approved.
- No unresolved product decision blocks technical foundation work.

---

# Phase 1: Technical Foundation

**Status:** Completed  
**Completed Date:** 2026-08-07

## Archived OpenSpec Changes

- `2026-08-07-initialize-project-foundation`

## Goal

Create a reliable development foundation for mobile, backend, database, and CI.

## Main Activities

### Mobile

- Create the Flutter project.
- Configure development, staging, and production environments.
- Configure Riverpod.
- Configure GoRouter.
- Configure Dio.
- Configure theme foundations.
- Configure error handling.
- Configure secure storage.
- Configure localization foundations.
- Configure crash reporting.

### Backend

- Create the NestJS project.
- Define the module structure.
- Configure Prisma.
- Configure PostgreSQL.
- Enable PostGIS.
- Configure validation.
- Configure exception handling.
- Configure structured logging.
- Configure Swagger.
- Add a health-check endpoint.

### Infrastructure

- Create repository structure.
- Configure Docker Compose.
- Configure GitHub Actions.
- Configure lint and tests.
- Configure environment validation.
- Configure local secrets.
- Create staging backend.
- Create staging database.

## Owner Decisions

- Repository strategy.
- Hosting provider.
- Database provider.
- Storage provider.
- Map provider.
- Monitoring provider.
- Deployment region.
- Major dependencies.

## Suggested OpenSpec Changes

- `initialize-repository-structure`
- `initialize-flutter-application`
- `initialize-nestjs-backend`
- `configure-postgresql-and-postgis`
- `configure-local-development-environment`
- `configure-ci-pipeline`

## Deliverables

- Flutter application runs on Android and iOS simulators.
- NestJS backend runs locally.
- PostgreSQL is connected.
- PostGIS is enabled.
- Prisma migrations work.
- Docker Compose works.
- CI passes.
- Health-check API is available.
- Flutter can call the health-check API.

## Dependencies

- Phase 0 completed.
- Hosting and provider decisions approved where required.

## Exit Criteria

- A new developer can clone and run the system from the README.
- CI performs linting and tests.
- Development and staging environments are separated.
- No secrets are committed.
- Mobile and backend can communicate.

---

# Phase 2: Authentication and User Management

**Status:** Planned

## Goal

Allow users to authenticate and manage sessions and account identity.

## Main Activities

- Implement selected login methods.
- Implement access tokens.
- Implement refresh tokens.
- Implement session storage.
- Implement device registration.
- Implement user profile.
- Implement avatar support.
- Implement sign-out.
- Implement session revocation.
- Define account deletion flow.

## Owner Decisions

- Supported login methods.
- Social login providers.
- Email and password support.
- Verified-email requirement.
- Maximum active devices.
- Account deletion policy.
- Data retention after deletion.
- Session recovery behavior.

## Suggested OpenSpec Changes

- `implement-authentication-foundation`
- `implement-social-login`
- `implement-user-profile`
- `implement-device-session-management`
- `implement-account-deletion-request`

## Deliverables

- Authentication API.
- Mobile authentication flow.
- Secure token storage.
- Refresh-token handling.
- User profile.
- Device list.
- Session revocation.
- Account deletion request.

## Dependencies

- Phase 1 completed.
- Authentication strategy approved.

## Exit Criteria

- Users can authenticate.
- Private APIs reject unauthenticated requests.
- Users can sign out.
- Users can revoke sessions.
- Refresh-token behavior is tested.
- Account deletion behavior is documented.

---

# Phase 3: Couple Connection

**Status:** Planned

## Goal

Allow two users to create or join a couple-owned Shared Space and manage the couple relationship.

## Main Activities

- Create a couple-owned Shared Space.
- Select Path, Orbit, or Bloom before invitation generation.
- Create invitation.
- Associate the invitation with the Shared Space and its selected World Style.
- Share invitation code.
- Support invitation deep links.
- View invitation.
- Preview the selected World Style before acceptance.
- Accept invitation.
- Reject invitation.
- Cancel invitation.
- View partner profile.
- View couple profile.
- Unlink couple.
- Ensure both connected users experience the same active World Style.

## Owner Decisions

- Maximum active couples per user.
- Invitation expiration.
- Unlink permissions.
- Recovery period after unlink.
- Shared-data behavior after unlink.
- Data export after unlink.
- Visibility of old Pins after unlink.

## Suggested OpenSpec Changes

- `add-couple-invitation`
- `add-invitation-deep-link`
- `add-couple-profile`
- `add-couple-unlink`

## Deliverables

- Shared Space creation and World Style selection flow.
- Invitation API.
- Mobile invitation flow.
- Couple membership model.
- Partner profile.
- Couple profile.
- Unlink flow.
- Race-condition tests.

## Dependencies

- Phase 2 completed.
- Couple business rules approved.

## Exit Criteria

- Two users can connect.
- The creating user selects World Style before invitation generation.
- The invited user previews and joins the invitation's existing World Style without selecting another one.
- A user cannot invite themselves.
- Invitations cannot be reused.
- Duplicate acceptance is handled safely.
- Unlink behavior follows the approved policy.

---

# Phase 4: Shared Map and Pin Core

**Status:** Planned

## Goal

Build the primary Pinus experience as a Living Canvas centered on a Living Shared Map with location-based Pins representing the couple's Shared Space.

## Main Activities

- Establish the Living Shared Map as the primary representation of the couple's Shared Space.
- Preserve Shared Space context across Pin inspection and Map/Timeline transitions when practical.
- Display the map.
- Display current location.
- Display Pin markers.
- Create Memory Pin.
- Create Plan Pin.
- Select a map location.
- Search for a location.
- View Pin detail.
- Edit Pin.
- Delete Pin.
- Query Pins by map bounds.
- Query nearby Pins.

## Owner Decisions

- Map provider.
- Required fields per Pin type.
- Pin edit permissions.
- Pin delete permissions.
- Whether partners may edit each other's Pins.
- Whether Pins require a location.
- Exact or approximate location display.
- Author visibility.
- User-visible delete behavior.

## Suggested OpenSpec Changes

- `add-shared-map`
- `add-memory-pin`
- `add-plan-pin`
- `add-pin-detail`
- `add-pin-editing`
- `add-pin-deletion`
- `add-map-bounds-query`
- `add-nearby-pin-query`

## Deliverables

- Shared map screen.
- Pin CRUD API.
- PostGIS location storage.
- Spatial indexes.
- Map-bounds query.
- Nearby query.
- Authorization tests.

## Dependencies

- Phase 3 completed.
- Map provider approved.
- Pin business rules approved.

## Exit Criteria

- The map represents the couple's accumulated shared places and content rather than generic travel or location discovery.
- A connected user can create a Pin.
- The partner can see it.
- Markers appear at correct locations.
- Cross-couple access is blocked.
- Edit and delete permissions are enforced.
- Spatial queries are indexed.

---

# Phase 5: Media and Timeline

**Status:** Planned

## Goal

Allow couples to attach images to Pins and browse their relationship history.

## Main Activities

- Request presigned upload URL.
- Upload images directly to storage.
- Attach media to a Pin.
- Upload multiple images.
- Reorder images.
- Delete images.
- Display timeline.
- Group timeline by month or year.
- Filter timeline by Pin type.
- Open Pin detail from timeline.
- Preserve Timeline as the temporal view of the same Pins represented spatially on the Living Shared Map.
- Keep Timeline items compact and scannable using a chronological Year → Month → Pin moments hierarchy.
- Preserve selected Pin and relevant filtering context between Map and Timeline when practical.
- Preserve Secret and Time Capsule lock semantics in Timeline.

## Owner Decisions

- Maximum images per Pin.
- Maximum upload size.
- Image quality.
- Original-image retention.
- Client-side compression.
- Storage provider.
- Media retention.
- Media deletion permissions.

## Suggested OpenSpec Changes

- `add-private-media-storage`
- `add-presigned-image-upload`
- `add-pin-media`
- `add-relationship-timeline`
- `add-timeline-filtering`

## Deliverables

- Private object storage.
- Presigned upload API.
- Pin media model.
- Upload progress.
- Media ordering.
- Timeline API.
- Timeline mobile screen.
- Broken-media fallback.

## Dependencies

- Phase 4 completed.
- Storage provider approved.
- Media limits approved.

## Exit Criteria

- Media is uploaded directly to private storage.
- Users cannot attach media to another couple's Pin.
- Timeline ordering is correct.
- Timeline and Map resolve to the same Shared Space Pin content rather than independent content models.
- Broken images do not crash the application.
- Failed and orphaned uploads are handled.

---

# Phase 6: Notifications and Realtime

**Status:** Planned

## Goal

Notify partners about important activity and synchronize open applications.

## Main Activities

- Register device tokens.
- Send push notifications.
- Handle notification taps.
- Connect WebSocket.
- Reconnect WebSocket.
- Send realtime Pin events.
- Add notification preferences.
- Remove invalid device tokens.
- Prevent self-notifications.
- Suppress common duplicates.

## Owner Decisions

- Push-triggering events.
- Whether edits generate notifications.
- Plan Pin reminder behavior.
- User-configurable notification categories.
- Email notification support.

## Suggested OpenSpec Changes

- `add-device-push-token`
- `add-push-notifications`
- `add-notification-deep-links`
- `add-websocket-realtime`
- `add-notification-preferences`

## Deliverables

- Push provider integration.
- Device-token management.
- WebSocket events.
- Notification deep links.
- Preference model.
- Retry behavior.
- Duplicate suppression.

## Dependencies

- Phase 5 completed.
- Notification event rules approved.

## Exit Criteria

- Background notifications arrive.
- Foreground realtime updates work.
- Notification taps open the correct screen.
- Invalid tokens are removed.
- Self-notifications are prevented.

---

# Phase 7: Secret Pin and Time Capsule

**Status:** Planned

## Goal

Add location-locked and time-locked experiences.

## Main Activities

### Secret Pin

- Configure unlock location.
- Configure unlock radius.
- Check current location manually.
- Validate distance on backend.
- Store unlock state.
- Optionally store unlock history.

### Time Capsule

- Configure unlock time.
- Validate unlock on backend.
- Handle time zones.
- Optionally send reminders.
- Prevent locked content from being returned.

## Owner Decisions

- Whether Secret Pin is part of MVP.
- Minimum and maximum radius.
- Fake-GPS resistance.
- Location-history storage.
- Early unlock permissions.
- Unlock-time editing.
- Reminder behavior.
- Re-lock behavior.

## Suggested OpenSpec Changes

- `add-secret-pin`
- `add-location-unlock-validation`
- `add-time-capsule`
- `add-time-capsule-reminders`

## Deliverables

- Secret Pin model.
- Time Capsule model.
- PostGIS distance validation.
- Server-time validation.
- Locked-content filtering.
- Unlock-state tracking.
- Time-zone tests.

## Dependencies

- Phase 6 completed.
- Privacy and unlock rules approved.

## Exit Criteria

- Locked content is not returned early.
- Location unlock uses backend validation.
- Time unlock uses server time.
- Time-zone edge cases are tested.
- Privacy policy is followed.

---

# Phase 8: Production Hardening

**Status:** Planned

## Goal

Prepare the application for controlled beta use.

## Main Activities

### Security

- Review authorization.
- Add rate limiting.
- Review token security.
- Validate uploads.
- Review secrets.
- Audit dependencies.
- Review session revocation.
- Test account deletion.

### Reliability

- Configure backups.
- Test restore.
- Define migration procedures.
- Configure monitoring.
- Configure alerting.
- Configure crash reporting.
- Configure API error tracking.

### Performance

- Validate pagination.
- Validate spatial queries.
- Review database indexes.
- Add image caching.
- Add lazy loading.
- Control response sizes.
- Run basic load tests.

### Release

- Prepare privacy policy.
- Prepare terms of service.
- Prepare App Store declarations.
- Prepare Play Store declarations.
- Create release checklist.

## Owner Decisions

- Backup retention.
- Incident severity.
- Service availability expectations.
- Support contact.
- Privacy policy.
- Terms of service.
- Analytics consent.
- Account deletion deadline.
- Beta release criteria.

## Suggested OpenSpec Changes

- `harden-authorization`
- `add-api-rate-limiting`
- `configure-backups`
- `configure-monitoring`
- `configure-analytics`
- `prepare-account-deletion`
- `prepare-beta-release`

## Deliverables

- Security checklist.
- Backup and restore test.
- Monitoring dashboard.
- Crash reporting.
- Analytics.
- Integration test coverage.
- Release checklist.
- Store compliance documentation.

## Dependencies

- Phases 1 through 7 completed or explicitly deferred.
- Legal and privacy decisions approved.

## Exit Criteria

- No known critical security issue remains.
- Backup and restore are verified.
- Critical APIs have integration tests.
- Crash reporting and monitoring work.
- Account deletion is tested end to end.
- Store compliance requirements are documented.

---

# Phase 9: Closed Beta

**Status:** Planned

## Goal

Validate user behavior with a controlled group before public release.

## Main Activities

- Recruit 20 to 50 couples.
- Distribute iOS TestFlight build.
- Distribute Android closed-test build.
- Collect in-app feedback.
- Monitor analytics.
- Monitor crashes.
- Triage bugs.
- Review funnel drop-off.
- Review retention.
- Prioritize beta fixes.

## Owner Decisions

- Beta participants.
- Whether beta is free.
- Beta duration.
- Beta stop criteria.
- Public-launch criteria.
- Post-beta priorities.

## Suggested OpenSpec Changes

- `add-in-app-feedback`
- `configure-beta-analytics`
- `prepare-testflight-release`
- `prepare-play-closed-testing`

## Deliverables

- Beta builds.
- Feedback channel.
- Analytics dashboard.
- Crash dashboard.
- Bug backlog.
- Beta report.
- Launch recommendation.

## Dependencies

- Phase 8 completed.
- Beta release approved.

## Exit Criteria

- Beta users complete core flows.
- Critical bugs are resolved or accepted.
- Retention and activation data are available.
- Privacy and account deletion flows work.
- Owner makes a public-launch decision.

---

# Post-MVP Roadmap

## Memory Interaction

- Reactions.
- Comments.
- Partner responses.
- Shared journal.

## Couple Experience

- Shared wishlist.
- Date ideas.
- Monthly recap.
- Then and Now.
- Anniversary reminders.
- Relationship constellation.

## AI Features

- Monthly relationship recap.
- Caption suggestions.
- Memory grouping.
- Location recommendations.
- Automatic trip summary.
- Photo selection for recap.

## Premium

- Increased storage.
- Video recap.
- Additional custom map treatments beyond the approved Path, Orbit, and Bloom World Styles.
- Advanced data export.
- Relationship photobook.
- Premium widgets.

Path, Orbit, Bloom, and switching between them are not premium-restricted. Any future monetization of additional styles or map treatments requires a separate approved product decision.

## Platform Expansion

- Web viewer.
- Tablet layouts.
- Wearable integration.
- Home-screen widgets.
- Desktop export tools.

---

## Roadmap Update Template

Use this format when updating a phase:

```md
## Roadmap Update

**Date:** YYYY-MM-DD  
**Phase:** Phase X  
**Previous Status:** Planned  
**New Status:** In Progress  

### Reason

Explain why the status changed.

### Scope Change

Describe any approved scope change.

### Blocking Decisions

List unresolved owner decisions.

### Related OpenSpec Changes

- change-name-one
- change-name-two
```

---

## Phase Completion Checklist

Before marking a phase as completed:

- [ ] Approved scope is implemented.
- [ ] Acceptance criteria pass.
- [ ] Required tests pass.
- [ ] Required documentation is updated.
- [ ] Relevant OpenSpec changes are archived.
- [ ] New behavior is reflected in `openspec/specs/`.
- [ ] Important decisions are recorded.
- [ ] Known risks are documented.
- [ ] No unresolved blocker remains.
