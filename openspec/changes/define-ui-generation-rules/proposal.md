## Why

Pinus has an approved visual direction, but future AI-assisted design and implementation work needs a durable textual contract that remains usable without the reference image. Defining explicit UI generation rules now will keep every flow recognizably Pinus, accessible, map-first, and within approved product scope.

## What Changes

- Establish a reusable light-first visual language with calm teal/mint branding, warm semantic accents, readable typography, rounded components, restrained depth, and consistent interaction states.
- Define Pinus UI as two coordinated layers: Pinus Core Brand before a shared space exists, and a Shared World Style after shared-space creation begins.
- Keep Welcome / Login, Minimal Profile Setup, and Couple Entry in Pinus Core while applying the selected World Style to shared-space creation, invitation, waiting, connection, and the Shared Map.
- Define Path, Orbit, and Bloom as presentation extensions owned by the shared couple space, experienced consistently by both partners, and prohibited from changing product functionality or duplicating the application architecture.
- Define the Living Shared Map as the primary representation of a couple-owned Shared Space and Timeline as the temporal view of the same Pin content.
- Establish Living Canvas as the continuous Shared Space experience model, preserving spatial-temporal and content context without requiring every interaction to use an overlay.
- Define Map and Timeline as the two primary Shared World perspectives and Our Space / Profile as a secondary management destination without locking a final navigation widget.
- Establish Two Signals as the non-functional pairing metaphor across invitation, waiting, and connection states.
- Confirm Path, Orbit, and Bloom are normally available and may be changed from Shared Space settings without premium, purchase, limit, or cooldown rules.
- Define navigation, form, copy, accessibility, and state-handling rules for mobile UI generation.
- Define required structures for entry, couple connection, shared map, Pin creation, content history, locked/unlocked experiences, and settings screens.
- Define one coherent visual system for Memory, Plan, Secret, and Time Capsule Pins across map, list, form, and detail contexts.
- Exclude additional Pin types from this change and remove stale Question Pin references from current product direction.
- Constrain AI-generated UI to approved Pinus features and prevent drift into dating, travel discovery, public social, fantasy, vintage, scrapbook, or excessively romantic aesthetics.
- Record brand, navigation, World Style, and product-scope boundaries while preserving only genuinely unresolved decisions for product-owner approval.
- Add no Flutter implementation, backend behavior, new product feature, final logo, or production visual asset.

## Capabilities

### New Capabilities

- `mobile-ui-generation-rules`: Textual, implementation-oriented requirements governing Pinus Core, Shared World Styles, onboarding and pairing boundaries, the visual system, screen composition, navigation, Pin representations, map and timeline experiences, lock states, forms, content, accessibility, and AI-assisted generation of Pinus mobile UI.

### Modified Capabilities

None.

## Impact

- Adds a design contract for future mobile design and Flutter changes; it does not change runtime behavior in this change.
- Guides AI-generated screens, design reviews, component/token definitions, and acceptance criteria across the approved Pinus product flow.
- Establishes Shared Space, Living Shared Map, Two Signals, and World Style ownership and presentation rules without defining persistence, API, or Flutter implementation details.
- Introduces no API, database, infrastructure, provider, dependency, or migration changes.
- Treats `docs/design/pinus-approved-ui-reference.png` as directional evidence only; the resulting specification is complete without that image and overrides unsupported details visible in it.
