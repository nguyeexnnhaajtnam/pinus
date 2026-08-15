# Pinus UI Generation Rules

This document is the implementation-facing design contract for future human- and AI-generated Pinus mobile UI. It is complete without the approved reference image. Product and OpenSpec requirements remain authoritative when they conflict with a visual example.

## Source traceability

| Rule area | Authoritative source | Extracted constraint |
|---|---|---|
| Product identity | `docs/product/product-proposal.md` | Private shared map for exactly two people; location, time, private content, and couple interaction are central. |
| Product scope | Product proposal and roadmap | Map, Pins, couple connection, media, timeline, notifications, Secret, and Time Capsule follow approved phases; no chat, calls, public social, or continuous location tracking. |
| Owner decisions | `docs/product/decision-policy.md` | Product scope, core flows, branding, privacy/security claims, providers, and costly or irreversible decisions require owner approval. |
| Visual direction | `docs/design/ui-direction.md` | Modern, warm, calm, light-first, rounded, restrained, teal/mint-led, map-first, with consistent Map–Timeline–Profile relationships. |
| Reference characteristics | Approved visual reference | Off-white surfaces, dark readable type, compact cards, soft corners, restrained depth, semantic Pin accents, and map prominence. The image is evidence, not a pixel specification. |
| Authentication | `mobile-social-login` and authentication specs | Google and Apple only where configured and available; provider proof is transient; deterministic loading, cancellation, and error states. |
| Identity and sessions | Identity/session specs | Identity is provider-scoped, sessions are secure and independently revocable, and UI must not invent identity or security guarantees. |
| UI generation behavior | `mobile-ui-generation-rules` delta | Semantic tokens, screen structures, Pin grammar, map/timeline rules, lock privacy, form UX, copy, accessibility, and AI guardrails. |

## Core and Shared World architecture

Pinus has two UI layers:

- **Pinus Core** applies before a Shared Space is created or joined. Welcome / Login, Minimal Profile Setup, and Couple Entry always use this layer and remain independent from Path, Orbit, and Bloom.
- **Shared World Experience** begins during Shared Space creation or after an invitation resolves. It covers Choose World Style, invitation creation and preview, Pairing / Waiting, Connection Success, Living Shared Map, Pin creation and detail, Timeline, Secret and Time Capsule states, and Shared Space settings.

World Style belongs to the Shared Space, never to an individual user. The creator selects Path, Orbit, or Bloom before generating an invitation. The invited partner previews and joins that selected style without choosing another one. Both partners experience the same active World Style.

Path, Orbit, and Bloom are all normally available. Switching between them is available at `Profile → Our Space → World Style` without a premium requirement, purchase, change limit, or cooldown unless a future approved requirement changes that rule.

All World Styles reuse the same product flow, navigation, information hierarchy, screen responsibilities, data requirements, accessibility, components, forms, and business logic. They may vary visual metaphor, color accents, map treatment, Pin presentation, shared-space illustration, motion, and decorative surfaces.

## Experience metaphors

- **Two Signals** is the pairing metaphor: two independent people connect, form one Shared Space, and begin building their shared world. It may guide motion and storytelling but never adds behavior.
- **Path** represents two individual journeys becoming one shared path through connection, movement, linked places, and progression. It must not resemble travel navigation or destination discovery.
- **Orbit** represents two people and their places forming one shared system through shared centers, balance, place relationships, and subtle orbital movement. It must avoid excessive sci-fi, galaxy, and space-game styling.
- **Bloom** represents the Shared Space growing as memories and experiences accumulate through progressive growth, organic expansion, branching relationships, and evolving surfaces. It must avoid literal floral, wedding, scrapbook, and overly romantic styling.

## Living Shared Map and Timeline

The Living Shared Map is the primary representation of the couple's Shared Space. It communicates where Memories, Plans, Secrets, and Time Capsules belong or happen and gains meaning as that content accumulates.

Timeline is the temporal view of the same Shared Space Pins. It communicates when those items happened or will happen. It is not an independent content model or social feed, and the map is not a generic location browser or travel-discovery surface.

## Living Canvas

The Shared Space uses a Living Canvas model: Map is the primary canvas, and Pin inspection and Timeline transitions remain connected to the same Shared Space whenever practical.

- Preserve the current Shared Space, selected Pin, and relevant filtering state across Map and Timeline where doing so is understandable and technically practical.
- A selected Timeline item should offer a way to reveal the same Pin on Map.
- A selected map Pin should remain identifiable when the user switches to Timeline where practical.
- Use overlays, sheets, or contextual expansion when they preserve useful context, but do not force complex or accessibility-sensitive content into overlays. Full-screen views remain valid.
- Motion may reinforce continuity but may not be required to understand state or complete an action.

## Intentionally excluded reference details

The following are not approved merely because they appear in a visual reference:

- Email/password, username/password, phone OTP, registration links, or password recovery. Current sign-in is Google and Apple only.
- End-to-end encryption wording or any absolute privacy/security promise not established by an approved security decision.
- Exact sampled colors, font family, logo artwork, illustrations, photographs, map style, component dimensions, or navigation implementation.
- Exact profile fields such as birthday, nickname, email display, or partner-visible data unless approved by the relevant product specification.
- Exact invitation lifetime, unlink behavior, author/edit/delete permissions, media limits, Secret radius, early unlock, reminders, or Time Capsule creation behavior.
- Any exact navigation widget inferred from the reference. The final component remains open and must preserve Map/Timeline primacy, secondary Our Space management, and non-duplicated destinations.
- Hearts, confetti, couple photography, or decorative relationship motifs as required identity elements.
- Public discovery points, restaurants, attractions, nearby recommendations, live partner location, relationship analytics, or other unsupported features.

## Visual principles

- Use a light-first interface with warm off-white foundations and high-contrast dark text.
- Make the map the dominant product surface. Supporting UI must not overpower geography.
- Express “exactly two people” through paired or shared states, provenance, and private-space language—not repeated avatars or romantic decoration.
- Prefer calm whitespace, concise hierarchy, rounded geometry, thin borders, and restrained depth.
- Keep one Pinus Core foundation across onboarding and every Shared World Style; style variation must not fragment functional architecture.
- Do not imitate dating, travel discovery, tourism, public social, fantasy, vintage, scrapbook, postcard, wedding, or productivity products.

## Semantic color roles

Exact production values are not defined here. Implementations must choose accessible values within these roles and validate them on every paired foreground/background surface.

| Token role | Direction | Required use |
|---|---|---|
| `brand.primary` | Calm teal | Primary actions, active navigation, focus accents, Memory identity. |
| `brand.primaryContainer` | Pale mint | Selected tonal controls, active segment backgrounds, calm highlights. |
| `pin.memory` | Teal family | Memory markers, icons, labels, chips, timeline and detail accents. |
| `pin.plan` | Warm orange | Plan future-intent identity across all representations. |
| `pin.secret` | Purple | Secret identity and location-lock states; not a fantasy effect. |
| `pin.timeCapsule` | Amber/yellow | Time Capsule identity and time-lock states; not gift or celebration styling. |
| `surface.canvas` | Warm off-white | Default screen background. |
| `surface.raised` | Near-white | Cards, sheets, inputs, and controls requiring separation. |
| `surface.mapOverlay` | Opaque/translucent neutral | Map controls only when text and controls remain readable over all map areas. |
| `text.primary` | Near-black neutral | Titles, labels, body text requiring strongest contrast. |
| `text.secondary` | Muted dark neutral | Helper text and metadata; must still meet applicable contrast. |
| `border.default` | Soft neutral | Input, card, divider, and control boundaries. |
| `feedback.success` | Accessible green | Completed system action; never substitutes for a Pin type. |
| `feedback.warning` | Accessible warm tone | Recoverable attention state; distinct from Time Capsule through icon and copy. |
| `feedback.error` | Accessible red | Validation, destructive action, and failure state. |
| `state.disabled` | Muted neutral | Disabled surfaces and content with adequate state visibility. |
| `state.focus` | High-contrast teal or platform focus | Keyboard and accessibility focus indication. |
| `overlay.scrim` | Neutral dark transparency | Modal separation without hiding necessary context. |

Color never acts alone. Every Pin, feedback, selection, and lock state also uses an icon, label, shape, border, or explanatory text.

## Shared scales

### Spacing

Use one restrained semantic spacing scale across Pinus Core and every World Style. Related content must be visibly grouped, sections must remain distinct, and responsive or platform-safe-area adjustments must preserve hierarchy. Exact spacing values remain a later UI-system decision.

### Radius

Use a small semantic radius scale that distinguishes compact controls, standard components, and prominent containers without creating unrelated shape languages. Circular treatment is reserved for functionally circular controls or identity elements. Exact radius values remain a later UI-system decision.

### Elevation

- Level 0: flat surface separated by whitespace.
- Level 1: thin border or extremely soft low-opacity shadow for cards and map overlays.
- Level 2: sheet, modal, or floating action requiring clear layering.
- No decorative heavy shadows, glow, glassmorphism, or stacked elevation without functional layering.

### Typography

Use the platform-default or owner-approved legible sans-serif family. A family change is an owner decision.

Use semantic roles for display, screen title, section title, body, label, helper, and metadata. Exact font family, weight, and size values remain later design-system decisions. Support platform text scaling without clipping, overlap, or loss of the primary action. Do not use all caps for sentences or low-contrast lightweight text for essential content.

### Iconography

Use one coherent simple outline or restrained-filled family with consistent optical size and stroke. Filled treatment may communicate selection. Icon-only actions require accessible names and at least 44×44 logical-pixel hit areas. Decorative illustration cannot replace an action or state label.

### Motion

Motion may explain connection, Pin placement, Map↔Timeline continuity, or lock-state change. Keep it brief, avoid bounce/confetti/sparkles, preserve final-state predictability, and provide reduced-motion behavior. No information or completion may depend on animation.

## Component rules and state matrix

| Component | Default | Pressed/selected/focus | Loading/disabled/error | Accessibility |
|---|---|---|---|---|
| Primary button | Filled `brand.primary`, high-contrast label, one dominant CTA per screen | Tonal shift; visible focus ring | Loading keeps width and prevents duplicate action; disabled remains legible; submission error appears near source | ≥44 high, descriptive label, progress announced |
| Secondary button | Outline, tonal, or text treatment | Clear pressed/focus state subordinate to primary | Disabled is visibly unavailable; never silently disappears if needed for recovery | ≥44 hit target and explicit label |
| Destructive button | Error text/outline; separated from routine actions | Confirmation/focus is visible | Loading prevents repeat; failure preserves current state | Action names consequence; never icon/color only |
| Text input | Persistent label, clear boundary, optional helper | Focus border/ring and cursor | Disabled/read-only differ; inline error plus corrective message | Label association, error announced, keyboard type appropriate |
| Date/time/location | Current value and source/permission state visible | Selected/focus visible | Permission, unavailable, invalid, and retry states explicit | Value and action have accessible names; no icon-only meaning |
| Media field | Add/reorder/remove states only when approved | Selection and upload focus visible | Per-item progress, retry, failure, broken-media fallback | Alternative labels and non-drag reorder method |
| Card/list row | Flat/Level 1, clear title and concise metadata | Selected uses border/container/icon, not color alone | Skeleton or explicit loading; unavailable content stays structurally stable | Whole-row action has label; nested actions do not conflict |
| Empty state | Short explanation, relevant visual cue, one next action | CTA follows button rules | Loading/error are separate from true empty | Copy explains state; illustration is optional |
| Sheet/modal | Rounded top/prominent radius, clear title, focused task | Scrim and focus containment | Prevent duplicate submit; error remains inside task context | Dismissal is predictable; focus returns to trigger |
| Chip/tag | Compact label plus optional icon | Selected has fill/border/icon change | Disabled remains readable | Not color-only; target ≥44 if interactive |
| Segmented control | Equal peer choices with concise labels | Current segment has container, text, and semantic selection | Disabled segment explained only when genuinely unavailable | Selection announced; swipe is never the only method |
| Floating create action | One map create action with plus/type-neutral create cue | Pressed/focus visible | Disabled only with reason; loading prevents repeats | ≥44×44 and named “Create Pin” |

## Allowed exceptions

Departures from these scales are allowed only for platform safe areas, native provider controls, map-provider attribution/legal controls, responsive text accommodation, or documented optical correction. Exceptions must preserve hierarchy, accessibility, and semantic roles and must not establish a second visual system.

## Pin visual system

### Common marker grammar

All Pin types use one location-marker family: a stable outer silhouette and anchor point, a type-colored container or border, a centered type symbol, and an optional nearby text label at zoom levels where labels remain legible. Marker proportions, hit target, selection expansion, preview behavior, and transition timing are shared.

| Type | Semantic color | Required symbol meaning | Plain label |
|---|---|---|---|
| Memory | Teal | Recorded moment or memory; use one approved symbol consistently | Memory |
| Plan | Orange | Future intent, destination, or flag | Plan |
| Secret | Purple | Location-bound lock | Secret |
| Time Capsule | Amber/yellow | Time-bound lock or hourglass | Time Capsule |

Do not use four unrelated illustrations. Do not substitute hearts for Memory, gift boxes for Time Capsule, or game/treasure symbols for Secret.

### Marker states

| State | Treatment |
|---|---|
| Default | Standard silhouette, semantic color, unique symbol; ≥44×44 inspection target even when visual marker is smaller. |
| Selected | Increased outline/halo or scale plus visible preview; preserves type color and symbol and remains anchored to the same coordinate. |
| Clustered | Shared neutral cluster container with count; homogeneous clusters may carry the type symbol, mixed clusters must not claim one type. |
| Locked | Type identity plus lock overlay/border and accessible “locked” label; no protected preview. |
| Ready | Type identity plus clear ready/open affordance and text; not inferred from color or animation alone. |
| Disabled/unavailable | Reduced emphasis plus explicit reason in preview/action; remains distinguishable from loading and locked. |
| Loading | Stable placeholder or progress on the related preview/action; marker does not jump to a false state. |

### Cross-context recognition matrix

Every implementation or generated design must verify this matrix:

| Context | Color | Symbol | Text/type name | State cue |
|---|---|---|---|---|
| Map marker | Required | Required | At accessible label/preview | Selection, cluster, lock as applicable |
| Create selector | Required | Required | Always required | Selected border/container/check |
| Chip/tag | Required or tonal | Required when space permits | Always required | Selected/disabled treatment |
| Timeline row | Accent required | Required | Always required | Lock/ready text when applicable |
| Locked view | Accent required | Lock + type cue | Type and state required | Explanation and supported CTA |
| Detail | Accent required | Required | Type label required | Provenance and lock/unlock status |

A type fails review if a grayscale or color-vision-deficiency inspection removes its only distinction.

## Navigation model

### Peer destinations

- Map and Timeline are the two primary Shared World perspectives.
- Our Space / Profile is a secondary management destination, not a third product perspective equal to Map and Timeline.
- The exact navigation component may evolve during UI design. No top-segmented or bottom-navigation widget is required by this architecture.
- Navigation must expose the current perspective, keep Our Space reachable, and avoid duplicate controls for the same destinations.
- Switching between Map and Timeline should preserve the selected Pin and relevant view or filter context when practical.

### Nested destinations

- Create, Pin Detail, lock states, edit forms, and settings subpages use platform-appropriate back navigation.
- Back returns to the invoking context where practical: Map retains camera/selection; Timeline retains group/scroll position; forms warn before discarding meaningful edits.
- Close is used for a modal task; Back is used for hierarchy. Do not swap them decoratively.

### Primary action placement

- Shared Map exposes one persistent, named Create Pin action in a safe thumb zone without covering attribution or selected content.
- Forms place the single submit action after content or in a keyboard-safe sticky region; it never competes with an equally prominent secondary action.
- Detail screens keep routine edit actions subordinate and destructive actions separated.

### Navigation-component approval test

Any persistent navigation component must preserve the Map/Timeline primary hierarchy, keep Our Space secondary, avoid duplicate destinations, preserve Create Pin access, and remain compatible with nested flows, keyboard states, map attribution, and accessibility. Choosing a specific persistent navigation widget remains a later UI design decision.
