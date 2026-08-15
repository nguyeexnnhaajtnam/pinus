## Context

See `proposal.md` for motivation. Pinus currently has product and engineering specifications but no durable capability specification for visual generation. `docs/design/ui-direction.md` and the approved reference establish a light-first, map-first direction with rounded components, restrained density, teal/mint branding, and semantic Pin accents. The reference also contains illustrative details that are not approved product requirements, so it cannot be copied literally.

This is a cross-cutting design-governance change: future onboarding, authentication, profile, couple connection, map, Pin, media, timeline, lock-state, and settings work will consume the same contract. The approved UI architecture has two coordinated layers: Pinus Core Brand before shared-space creation and a Shared World Style extension for creation, pairing, and the shared experience. The specification must therefore be understandable and reviewable without the image, independent of a particular design tool, and practical for later Flutter component work.

## Goals / Non-Goals

**Goals:**

- Translate approved visual characteristics into semantic, testable UI rules.
- Establish shared token categories, component expectations, Pin-type semantics, screen composition, navigation, content, accessibility, and AI-generation guardrails.
- Establish a stable boundary between Pinus Core screens and World Style-aware shared-space screens.
- Preserve one functional screen and component architecture while allowing Path, Orbit, and Bloom to vary approved presentation attributes.
- Keep the Living Shared Map and Timeline as spatial and temporal views of the same Shared Space Pins.
- Apply Living Canvas continuity across Map, Timeline, Pin inspection, and nested content without requiring one presentation container.
- Preserve Map and Timeline as the primary perspectives while keeping Our Space / Profile secondary and the exact navigation component open.
- Use Two Signals as visual pairing language without adding product behavior.
- Make the rules useful as acceptance criteria for design artifacts and future Flutter implementation.
- Separate reusable visual decisions from unresolved product-owner decisions.

**Non-Goals:**

- Select final hex values, production typography, logo artwork, illustration assets, or map-provider styling.
- Produce Flutter widgets, backend behavior, or working prototypes.
- Define World Style persistence or API implementation details, or introduce future monetization behavior beyond the approved free availability of Path, Orbit, and Bloom.
- Treat every element in the reference image as approved product behavior.
- Resolve product rules such as permissions, Secret radius, Time Capsule early access, media limits, or unlink behavior.

## Decisions

### 1. Define one capability spanning generation rules

All rules live under `mobile-ui-generation-rules` because they form one consumer-facing contract: a generated screen is valid only when visual language, screen structure, state semantics, accessibility, and product scope agree. Splitting tokens, map, timeline, forms, and AI constraints into independent capabilities would allow partial adoption and visual drift.

Alternative considered: one capability per screen family. Rejected because it would duplicate cross-cutting rules and make consistency harder to validate.

### 2. Use semantic roles before fixed brand values

The specification mandates stable roles such as primary brand, surface, text, Memory, Plan, Secret, Time Capsule, error, border, and focus. Exact production color values remain a later reversible implementation choice unless the owner finalizes them. Baseline direction is teal/mint primary, orange Plan, purple Secret, amber Time Capsule, off-white surfaces, and dark neutral text.

Alternative considered: copy exact sampled colors from the image. Rejected because the image is directional, visual sampling is fragile, and accessibility may require adjustment.

### 3. Preserve type identity through redundant cues

Each Pin type uses a shared marker and component grammar while combining semantic color with a unique symbol and explicit label where space permits. Lock state overlays or modifies the common grammar rather than replacing it with a different metaphor.

Alternative considered: four unrelated marker illustrations. Rejected because it weakens system coherence and increases recognition and implementation cost.

### 4. Treat Map and Timeline as the primary perspectives on the same objects

Map is the primary spatial surface and Timeline is the chronological view of the same Pins. Shared type tokens, labels, selection behavior, relevant filtering context, and detail destinations preserve this relationship. Our Space / Profile is a secondary management destination rather than a third product perspective. The exact navigation component remains open for later UI design and must preserve this hierarchy.

Alternative considered: three equal Map, Timeline, and Profile destinations using a prescribed navigation widget. Rejected because it weakens the Shared World hierarchy and prematurely locks visual implementation.

### 5. Separate visual reference evidence from product truth

The reference contributes tone, hierarchy, density, rounded geometry, light surfaces, map prominence, and semantic accent relationships. Repository product documents and OpenSpec requirements remain authoritative for functionality. Unsupported reference elements—such as email/password fields or security claims—are excluded.

Alternative considered: reproduce the reference screen by screen. Rejected because the user explicitly defined it as non-pixel-perfect and because a screenshot can contain stale or speculative behavior.

### 6. Validate generated work with a traceable checklist

Future implementation should maintain a compact UI-generation checklist mapping each screen to required structure, token usage, supported states, accessibility checks, prohibited features, and owner decisions. Reviews should inspect at least default, loading, empty, error, disabled, locked/unlocked where relevant, text-scaled, and reduced-color-cue variants.

Alternative considered: rely on subjective visual review. Rejected because it cannot reliably detect scope drift or missing interaction states.

### 7. Keep motion semantic and optional

Motion may communicate connection, spatial placement, time progression, and lock-state change, but it must be brief, reversible, reduced-motion aware, and unnecessary for understanding. This leaves room for future motion design without making animation a dependency of the textual rules.

Alternative considered: prescribe signature animations now. Rejected because tooling and interaction details are not yet finalized.

### 8. Use Pinus Core before shared-space creation

Welcome / Login, Minimal Profile Setup, and Couple Entry use Pinus Core because no shared couple space and therefore no shared World Style exists yet. Pinus Core communicates the product identity and the private two-person shared-map purpose without presenting Path, Orbit, or Bloom as entry-screen choices.

Alternative considered: theme the complete onboarding journey with an individual user's preferred style. Rejected because World Style belongs to the shared space rather than an individual and cannot exist before the shared-space creation or invitation context is established.

### 9. Begin World Style at shared-space creation and invitation preview

The creating flow introduces World Style at Create Our Space and Choose World Style, then carries it through Generate Invitation, Pairing / Waiting, Connection Success, and Living Shared Map. The joining flow remains in Pinus Core through Couple Entry, then loads and previews the inviting Shared Space's World Style before acceptance. The invited partner can accept or reject the invitation but cannot independently select a different style for that Shared Space.

Alternative considered: let each partner select a personal style. Rejected because it would fragment the shared-world identity and contradict shared-space ownership.

### 10. Implement World Style as an extension layer

All styles reuse the same typography, spacing, component architecture, accessibility rules, information hierarchy, navigation patterns, forms, interaction fundamentals, and functional screen composition. World Style supplies selected colors, visual metaphor, hero treatment, motion, background decoration, map and Pin treatment, spatial effects, and shared-space illustration treatment through shared extension points rather than separate screen families.

Alternative considered: create unrelated Path, Orbit, and Bloom implementations for each pairing screen. Rejected because it duplicates behavior, increases accessibility and maintenance risk, and makes one product behave like three applications.

### 11. Keep World Style metaphors behavioral but non-functional

Path represents two individual journeys becoming one shared path. Orbit represents two people becoming part of one shared system. Bloom represents a shared world growing as memories and experiences accumulate. These metaphors may guide visual transitions, composition, decorative surfaces, and motion, but they never alter available actions, navigation, validation, permissions, or product behavior.

Alternative considered: give each style unique workflows or features. Rejected because World Style is an extension of the core design system, not a product-mode switch.

### 12. Model the Shared World as one spatial-temporal content system

The Living Shared Map is the primary representation of the couple-owned Shared Space. Timeline presents the same Pins by time rather than location. Both views resolve to the same content identity, detail destinations, type semantics, and permissions.

Alternative considered: treat Timeline as a separate relationship feed. Rejected because it would duplicate the content model, introduce social-feed expectations, and weaken the map-first product model.

### 13. Use Two Signals for pairing storytelling

Two Signals represents two independent people connecting to form one Shared Space. It may shape hero composition, connection motion, invitation feedback, waiting states, and Connection Success, while all state transitions and invitation behavior remain governed by the shared functional architecture.

Alternative considered: use a different pairing metaphor for every World Style. Rejected because Two Signals supplies a stable product-level connection story while World Style supplies presentation treatment.

### 14. Treat approved World Styles and switching as normally available

Path, Orbit, and Bloom are available without premium gating. The active style may be changed from `Profile → Our Space → World Style` without purchase, change-count, or cooldown restrictions. New styles and future monetization remain separate owner decisions.

Alternative considered: retain generic premium-theme guardrails. Rejected because they conflict with the approved availability of all three planned styles and could incorrectly gate normal switching.

### 15. Use Living Canvas to preserve context without mandating overlays

Shared Space should feel like one continuous living environment. Map remains the primary canvas; selected Pin, relevant filters, and Shared Space context should carry between Map, Timeline, and content inspection when practical. A Timeline item can reveal the same Pin on Map, and a map selection remains identifiable in Timeline when practical.

Overlays and sheets are useful when they preserve context, but full-screen views remain valid when content complexity, platform conventions, or accessibility make them clearer. Motion may reinforce continuity but cannot be the only way state or relationships are communicated.

Alternative considered: require every detail and transition to remain on top of the map. Rejected because it would turn a continuity principle into a container constraint and could harm complex content and accessibility.

## Risks / Trade-offs

- [Semantic rules may still allow visual variation] → Require shared component/token use and screen-level review rather than attempting pixel-perfect prescriptions.
- [Temporary visual measurements may be interpreted as final architecture] → Keep exact spacing, radius, typography, color, animation, and navigation-widget choices outside normative UX requirements until separately approved.
- [A single capability is large] → Organize requirements by observable concern and derive focused checklists during implementation.
- [Future product specs may change screen behavior] → Product and feature specs remain authoritative; update this capability through a new delta when approved behavior creates a visual-system change.
- [Reference-image details could leak into generated UI] → Require traceability to textual requirements and explicitly exclude unsupported authentication, security, and feature claims.
- [Accessibility adjustments may differ from the reference] → Accessibility and platform usability take precedence over visual matching.
- [World Style could fragment the product into separate applications] → Enforce shared functional architecture and constrain style variation to explicit presentation extension points.
- [A joining user could see an incorrect style before invitation data loads] → Use Pinus Core for loading and error states, then reveal only the invited shared space's resolved World Style during preview.

## Migration Plan

1. Archive the completed capability into the main OpenSpec set after approval.
2. Create a textual token catalog, Pinus Core baseline, World Style extension contract, and screen-generation checklist derived from the capability.
3. Audit future design and Flutter changes against the checklist before implementation approval.
4. When an existing generated screen conflicts with the new contract, update it during its next approved UI implementation change rather than treating this planning-only change as authorization to modify runtime UI.

Rollback consists of reverting the planning artifacts before archive or creating a follow-up delta after archive; this change performs no runtime or data migration.
