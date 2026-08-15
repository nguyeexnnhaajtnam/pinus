# Pinus AI UI Generation Checklist

This checklist gates AI-assisted design and UI implementation. Complete the preflight before generation and the review after generation. A checked item means it was verified against current product and OpenSpec sources, not assumed from a reference image.

## Preflight

### Scope and authority

- [ ] Name the exact approved screen/flow being generated and its current source specification.
- [ ] Confirm the output is design, documentation, or implementation as requested; do not silently cross those boundaries.
- [ ] List unresolved owner decisions that affect the output and leave them visibly unresolved.
- [ ] Exclude chat, calls, public social, followers, likes/comments, live partner tracking, distance tracking, discovery/recommendations, tourism, games/scores/streaks, calendar/task management, marketplace, AI assistant, and other unapproved domains.
- [ ] Do not invent privacy, encryption, location accuracy, delivery, retention, or unlock guarantees.

### Authentication and user data

- [ ] Sign-in uses Google and Apple only where configured/available.
- [ ] No email/password, username/password, phone OTP, password recovery, or extra provider is introduced.
- [ ] Profile and settings fields exist in approved requirements; optional and partner-visible data is described truthfully.

### Visual system

- [ ] Classify the screen as Pinus Core or Shared World Experience before applying visual styling.
- [ ] Keep Welcome / Login, Minimal Profile Setup, and Couple Entry independent from Path, Orbit, and Bloom.
- [ ] For Shared World screens, use the Shared Space's active World Style and one common functional architecture.
- [ ] Use semantic token roles from `ui-generation-rules.md`; do not sample arbitrary screen-local values from the image.
- [ ] Use one light-first, warm off-white, dark-text, teal/mint-led product identity.
- [ ] Use shared spacing, radius, typography, icon, elevation, component, and motion scales.
- [ ] Identify applicable component states before generation: default, pressed/selected, focus, loading, disabled, error, empty, retry, locked, ready, and unlocked.

### Screen hierarchy and navigation

- [ ] Apply the relevant section of `screen-generation-checklists.md`.
- [ ] Define the screen purpose, first-read content, one primary CTA, secondary actions, and destructive separation.
- [ ] Treat Map and Timeline as the two primary Shared World perspectives and Our Space / Profile as a secondary management destination.
- [ ] Do not lock the design to top-segmented or bottom navigation without a later approved UI decision.
- [ ] Keep Create Pin readily accessible from Map and preserve geographic/location context through creation.

### Pin and content consistency

- [ ] Memory, Plan, Secret, and Time Capsule use the common marker grammar and their semantic color + symbol + label combination.
- [ ] The same Pin preserves identity in map, selector, chip, timeline, lock state, and detail.
- [ ] Timeline is chronological shared history of map Pins, not a social feed.
- [ ] Map and Timeline represent spatial and temporal views of the same Shared Space Pin content.
- [ ] Timeline defaults to compact, scannable chronology and preserves past/future and lock-state semantics.
- [ ] Selected Pin and relevant filter context remain connected across Map and Timeline when practical.
- [ ] Locked content is absent from generated previews, mock data, alt text, filenames, and accessibility labels.

### Copy

- [ ] Copy is warm, calm, concise, private, and action-specific.
- [ ] Copy is not childish, corporate, promotional, guilt-inducing, game-like, or excessively romantic.
- [ ] Plain behavior labels take precedence over metaphors when comprehension could suffer.

## Post-generation review

### Product and aesthetic drift

- [ ] Every visible feature maps to approved scope; no plausible-looking extra feature was invented.
- [ ] The result does not resemble a dating app, travel/tourism/discovery product, public social feed, fantasy world, scrapbook, postcard, vintage diary, wedding app, or productivity dashboard.
- [ ] No restaurants, attractions, hotels, nearby recommendations, public POIs, or continuous partner-location controls appear on the map.
- [ ] “Two people” is communicated through shared/provenance behavior rather than repeated avatars, hearts, couple silhouettes, or romantic photography.
- [ ] Pairing uses Two Signals without adding behavior, and preserves the selected Shared Space World Style once available.
- [ ] The interface remains light-first, restrained, rounded, readable, and map-first across all screens.

### Consistency

- [ ] Equivalent components use the same token, geometry, state behavior, terminology, and interaction.
- [ ] Path, Orbit, and Bloom vary only approved presentation attributes and do not create separate product flows or screen architectures.
- [ ] Pin type and lock-state cues remain consistent across all contexts and do not rely on color alone.
- [ ] Navigation uses one coherent model; top and bottom controls do not duplicate destinations.
- [ ] Context continuity does not force every detail into an overlay; complex or accessibility-sensitive content may use full-screen views.
- [ ] Each screen has one dominant CTA and predictable back/close behavior.
- [ ] Loading, empty, error, disabled, retry, offline/permission, selected, locked, ready, and unlocked states are distinct where applicable.

### Claims and owner decisions

- [ ] No unsupported security, privacy, expiry, location, reminder, permission, media-limit, or unlock claim appears.
- [ ] Path, Orbit, Bloom, and switching between them remain normally available without premium restrictions; new styles, monetization, final logo, font-family changes, major navigation changes, Pin semantics, and scope changes remain owner decisions.
- [ ] Reference-image details excluded by `ui-generation-rules.md` have not leaked into the output.

## Accessibility gate

- [ ] Every interactive target is at least 44×44 logical pixels, including icon-only, marker, chip, and segmented actions.
- [ ] Normal text and essential icons meet WCAG AA contrast on every actual background, including maps and media.
- [ ] Color is never the sole cue for Pin type, selection, validation, feedback, lock, ready, or disabled state.
- [ ] Text scaling does not clip content, hide labels, overlap controls, or make the primary action unreachable.
- [ ] Inputs retain persistent labels, appropriate keyboard types, clear required/optional status, inline errors, and announced validation.
- [ ] Keyboard appearance does not obscure the focused input, error, or submit action.
- [ ] Icon-only actions, images, markers, navigation segments, progress, and state changes have meaningful screen-reader names.
- [ ] Focus order follows visual/task order; modal focus is contained and returns to the trigger.
- [ ] Loading is announced, duplicate action is prevented, and disabled controls remain understandable.
- [ ] Reduced-motion mode removes nonessential movement; no meaning or completion depends on animation.
- [ ] Protected content is absent from the accessibility tree until authorized for display.

## Text-only completeness test

Perform this review without opening the approved image:

- [ ] Visual direction can be reconstructed from semantic roles, scales, component rules, and prohibited aesthetics.
- [ ] Navigation and primary-action placement are unambiguous.
- [ ] Every approved screen group has hierarchy, required elements, CTA, state handling, and prohibited content.
- [ ] All four Pin types and every map/list/detail/lock representation are distinguishable.
- [ ] Map, Timeline, creation forms, lock/unlock, copy, and accessibility behavior are independently understandable.
- [ ] Owner decisions and implementation boundaries are explicit.

## Scope integrity test

- [ ] No Flutter source, backend source, API, database change, or dependency is created by applying these documentation rules.
- [ ] No production logo, illustration, photograph, map style, or final brand asset is claimed as delivered.
- [ ] No new feature, authentication method, privacy/security promise, or product rule is introduced.
- [ ] Any future UI implementation must be authorized by its own applicable change and reviewed against these rules.
