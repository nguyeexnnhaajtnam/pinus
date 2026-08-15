# Pinus Screen Generation Checklists

Use these checklists with `ui-generation-rules.md`. A screen is not approved merely because it visually resembles the reference; it must satisfy the relevant product and state checklist.

## Rules for every screen

- [ ] Uses shared semantic tokens, typography, radius, icons, and component states.
- [ ] Has one clear screen purpose and one visually dominant primary action where an action is needed.
- [ ] Handles loading, empty, error, disabled, and retry states that can occur.
- [ ] Preserves entered or meaningful content through recoverable failures.
- [ ] Meets accessibility review requirements and contains no unsupported feature or promise.
- [ ] Uses concise, warm, calm, private wording—not childish, promotional, corporate, or excessively romantic copy.

## A. Entry and onboarding

Welcome, Sign in, Minimal profile setup, and Couple Entry use Pinus Core. They must not preview or apply Path, Orbit, or Bloom.

### Welcome

- [ ] Hierarchy: Pinus identity → concise private shared-map value proposition → supporting two-person/map context → primary continuation.
- [ ] Required: map-first purpose and exactly-two-person scope; illustration is optional and subordinate.
- [ ] CTA: one “Get started” or equivalent action in the lower thumb zone.
- [ ] States: initialization/loading does not flash the wrong auth destination; failure offers retry if startup cannot resolve.
- [ ] Prohibited: unsupported encryption/privacy guarantees, travel marketing, romantic slogans, sign-up field clutter.

### Sign in

- [ ] Hierarchy: clear sign-in title → short account context → provider actions → recoverable error area.
- [ ] Required: Google and Apple only when configured and available on the platform; provider controls remain recognizable.
- [ ] CTA: each provider action is explicit; only one provider attempt can be active.
- [ ] States: per-provider available, unavailable/omitted, loading, cancellation-to-idle, sanitized failure, retry.
- [ ] Prohibited: email/password, username/password, phone OTP, password reset, identity claims derived from client input.

### Minimal profile setup

- [ ] Hierarchy: purpose → optional avatar only if approved → essential approved fields → visibility explanation → continue.
- [ ] Required: persistent labels; optional fields marked optional; truthful explanation of partner visibility.
- [ ] CTA: one Continue action; keyboard must not obscure it.
- [ ] States: avatar/media progress where present, inline validation, preserved values, loading and retry.
- [ ] Prohibited: unapproved birthday, gender, relationship analytics, public profile, username requirements, or unnecessary biography fields.

### Couple Entry

- [ ] Uses Pinus Core and presents Create Our Space and Enter Invitation Code as the two approved paths.
- [ ] Does not present Path, Orbit, or Bloom as choices before the creating user enters Create Our Space.
- [ ] Keeps invitation loading and invalid-code states in Pinus Core until a Shared Space and its World Style resolve.

## B. Couple connection

All pairing screens use the Two Signals metaphor and one shared functional architecture. World Style may vary colors, hero treatment, motion, background decoration, and spatial effects without changing actions, validation, invitation semantics, or accessibility.

### Create Our Space / Choose World Style

- [ ] The creator selects Path, Orbit, or Bloom before invitation generation.
- [ ] All three styles are available without premium labels, locks, purchases, limits, or cooldown claims.
- [ ] Path, Orbit, and Bloom previews explain visual character without implying different product functionality.

### Invite partner

- [ ] Hierarchy: connection purpose → selected Shared Space / World Style context → invitation status/code → share action → concise help.
- [ ] Required: readable/selectable code when supported, share action, selected World Style continuity, and truthful validity status from product behavior.
- [ ] CTA: Generate or Share Invitation is primary; changing World Style returns to the approved creation step rather than silently changing an issued invitation.
- [ ] States: create/share/copy success, invalid or expired code, network error, duplicate action prevention.
- [ ] Prohibited: public invite discovery, multiple partners, relationship scoring, guaranteed expiry not defined by the backend.

### Enter invitation code / invitation preview

- [ ] Code entry and unresolved loading use Pinus Core.
- [ ] A resolved invitation previews the selected Shared Space World Style before acceptance.
- [ ] The invited partner may accept or reject but cannot select a different World Style.
- [ ] Invalid, expired, cancelled, already-used, and network-failure states do not display a guessed World Style.

### Waiting for partner

- [ ] Hierarchy: current waiting state → partner/invite context → invitation code/status → cancel, retry, or share actions supported by product rules.
- [ ] Required: no fake progress; connection updates are announced when received.
- [ ] CTA: Share/copy can remain primary; Cancel is secondary/destructive according to consequence.
- [ ] States: waiting, reconnecting, expired/cancelled, accepted, recoverable network failure.
- [ ] Tone: patient and calm; no guilt, countdown pressure, or romantic theatrics.
- [ ] Uses the selected Shared Space World Style and Two Signals without changing waiting-state behavior.

### Connection success

- [ ] Hierarchy: success state → two-person Shared Space explanation → single Enter Living Shared Map action.
- [ ] Required: paired/shared visual cue and truthful privacy wording.
- [ ] CTA: one action enters the shared map.
- [ ] States: success is stable and idempotent; navigation loading prevents repeated entry.
- [ ] Prohibited: confetti, wedding imagery, heart explosions, public sharing, unsupported security guarantees.
- [ ] Uses the selected World Style and transitions into the same style on the Living Shared Map.

## C. Shared map

### Common map frame

- [ ] Treats the Living Shared Map as the primary representation of the couple's Shared Space, not a generic location browser.
- [ ] Geography, roads, water, labels, attribution, and platform/map-provider controls remain readable.
- [ ] Map and Timeline are presented as the two primary Shared World perspectives; Our Space / Profile remains a reachable secondary management destination.
- [ ] The navigation component does not imply that Our Space is a third product perspective equal to Map and Timeline or duplicate the same destinations elsewhere.
- [ ] Create Pin action is visible, thumb-accessible, named, and does not obscure map attribution or selected content.
- [ ] Map controls use readable overlay surfaces across light and visually busy regions.
- [ ] Current location, permission, offline, loading, and map failure states are explicit when applicable.
- [ ] No restaurants, attractions, hotels, nearby recommendations, tourism discovery, partner distance, or continuous partner location.

### Empty map

- [ ] Map remains visible and interactive behind a concise empty-state surface.
- [ ] Copy explains that meaningful content comes from the couple and invites the first Pin.
- [ ] One primary Create first Pin action; no fake markers or public POIs.
- [ ] Empty is distinct from loading, filtering-to-zero, offline, and failed-to-load.

### Populated map

- [ ] Memory, Plan, Secret, and Time Capsule use the shared marker grammar and redundant type cues.
- [ ] Default, selected, clustered, locked, disabled/unavailable, and overlapping states remain distinguishable.
- [ ] Selection reveals a concise preview and direct Pin-detail action without permanently covering geography.
- [ ] Cluster count is readable and cluster expansion is predictable; type identity is not fabricated for mixed clusters.
- [ ] Locked markers disclose no protected content.

## D. Creation flows

### Shared creation frame

- [ ] Retains or summarizes the selected coordinate and provides a clear way to correct location.
- [ ] Shows selected Pin type with color, icon, and label; type change preserves compatible data and warns before losing incompatible data.
- [ ] Uses persistent labels, explicit optional fields, low density, one Save action, and subordinate cancel/back behavior.
- [ ] Handles validation inline, duplicate submission, location permission, media progress/retry, network error, and preserved values.
- [ ] Does not invent edit permissions, media limits, or lock behavior.

### Create Memory

- [ ] Prioritizes title, occurred date, location, note, and optional approved media.
- [ ] Date language describes something that happened; future-only semantics are not introduced.
- [ ] CTA is “Save Memory” or equally plain language.

### Create Plan

- [ ] Prioritizes title, location, optional target date, note, and approved reminder only if supported.
- [ ] Future intent is clear without becoming a calendar, task manager, or travel recommendation flow.
- [ ] CTA is “Save Plan” or equally plain language.

### Create Secret

- [ ] Prioritizes title, location, approved location-lock explanation, note/media, and any approved unlock configuration.
- [ ] Clearly states that protected content will not be available before the condition; preview never leaks content after save.
- [ ] Avoids treasure-hunt, game, reward, fake-GPS, or security claims not established by requirements.
- [ ] CTA is “Save Secret” or equally plain language.

Time Capsule creation is not generated until its creation flow and editable fields are explicitly approved.

## E. Content views

### Pin detail

- [ ] Hierarchy: meaningful media/title → type → location/date or condition → note → approved provenance → management actions.
- [ ] Type color, icon, and label match map, selector, and Timeline representations.
- [ ] Edit/delete appear only under approved permissions; delete is separated and consequence-aware.
- [ ] Broken or unavailable media has a stable fallback; loading does not collapse layout.
- [ ] Opening from Map or Timeline reaches the same canonical detail and back returns predictably.
- [ ] Preserves Shared Space and source context when practical; uses a full-screen view when content complexity or accessibility makes it clearer than an overlay.

### Timeline / history

- [ ] Uses a compact chronological hierarchy such as Year → Month → Pin moments rather than large social-feed cards by default.
- [ ] May include past Memories, future Plans, and locked, upcoming, ready, or unlocked Secret and Time Capsule entries.
- [ ] Preserves protected-content boundaries for Secret and Time Capsule states.
- [ ] Preserves the selected Pin and relevant filtering state from Map when practical and offers Reveal on Map for the same Pin.
- [ ] Presents the temporal view of the same Shared Space Pins shown spatially on the Living Shared Map.
- [ ] Does not create an independent content model, public feed, or social-feed interaction pattern.

- [ ] Represents the same Pins as the map, grouped by month or year in descending or approved chronological order.
- [ ] Each row/card is concise: type cue, date, title, optional compact location/media, and detail action.
- [ ] Empty, initial loading, pagination loading, filtering-to-zero, error, and retry are distinct.
- [ ] Map relationship is visible through shared type tokens and peer navigation; selected entry can return to its map context when supported.
- [ ] Prohibited: likes, followers, public comments, engagement counts, ranking, infinite-feed theatrics, or public author profiles.

## F. Secret and Time Capsule states

### Shared protected-content rules

- [ ] Locked UI renders only approved non-sensitive metadata and never hidden note, media, thumbnail, alt text, filename, or cached preview.
- [ ] Lock state uses icon + label + explanation, never blur alone or color alone.
- [ ] CTA exists only when product behavior supports a check, retry, open, or detail action.
- [ ] State changes are announced accessibly; reduced motion uses an immediate or simple transition.
- [ ] Errors never fall back to displaying protected content.

### Secret locked

- [ ] Purple Secret identity plus location-lock icon and plain location-condition messaging.
- [ ] Manual location check, permission request, or retry appears only when supported and explains why location is needed.
- [ ] No hidden content preview, distance game, map treasure trail, points, or early unlock promise.

### Secret ready / unlocked

- [ ] Ready state clearly says the approved condition is satisfied and exposes the supported Open action.
- [ ] Unlocked state uses the normal Pin-detail hierarchy while retaining Secret type provenance.
- [ ] Unlock transition communicates a verified state change, not a reward spectacle.

### Time Capsule locked

- [ ] Amber identity plus time-lock icon and exact approved unlock date or truthful general status.
- [ ] No false live countdown, early opening, edit-unlock-time, or reminder action unless explicitly supported.
- [ ] No gift boxes, birthday graphics, magical particles, or protected-content preview.

### Time Capsule ready / unlocked

- [ ] Ready state distinguishes “available to open” from already opened and provides the supported action.
- [ ] Unlocked state reveals content through normal detail hierarchy with Time Capsule provenance and relevant timestamps.
- [ ] Server-authorized time remains the truth; client clock alone never drives a misleading visual state.

## G. Profile and couple settings

- [ ] Uses the same light surfaces, typography, segmented navigation, cards, and action hierarchy as Map and Timeline.
- [ ] Shows only implemented identity and couple information approved for display.
- [ ] Groups supported actions under Account, Couple, Notifications, Privacy/Security, Sessions, and Data only when those capabilities exist.
- [ ] Routine navigation rows use predictable disclosure; current values are concise and truthful.
- [ ] Logout, unlink, account deletion, and destructive data actions are separated, consequence-aware, and only shown when implemented.
- [ ] Handles loading, partial failure, save progress, validation, retry, and stale-session outcomes without losing unrelated settings.
- [ ] Provides `Our Space → World Style` when Shared Space settings and style switching are implemented.
- [ ] Offers Path, Orbit, and Bloom switching without premium locks, purchase requirements, change limits, or cooldowns.
- [ ] Prohibited: love scores, compatibility, streaks, anniversary dashboards, public profiles, followers, or unapproved monetization and switching restrictions.
