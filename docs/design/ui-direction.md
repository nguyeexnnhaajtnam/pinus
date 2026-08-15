# Pinus UI Architecture

## Product Experience Model

Pinus UI has two coordinated layers:

1. Pinus Core
2. Shared World Experience

Pinus Core represents the Pinus product before a Shared Space has been created or joined. It includes Welcome / Login, Minimal Profile Setup, and Couple Entry and remains independent from Path, Orbit, and Bloom.

The Shared World Experience begins when a user creates or joins a Shared Space. It includes World Style selection, invitation creation and preview, pairing and waiting states, Connection Success, Living Shared Map, Pin creation and detail, Timeline, Secret and Time Capsule states, and Shared Space settings.

---

## Living Shared Map

The Living Shared Map is the primary representation of the couple's Shared Space. Memories, Plans, Secrets, and Time Capsules progressively add meaning to that world over time.

Map and Timeline are two views of the same Shared Space content:

- Map communicates where Pins belong or happen.
- Timeline communicates when Pins happened or will happen.

The map must not resemble a generic location browser, travel-navigation product, or public discovery map. Timeline must not resemble an independent or public social feed.

---

## Living Canvas

The Shared Space should feel like one continuous living environment rather than a collection of unrelated modules.

The Living Shared Map is the primary canvas. Pin interactions, content inspection, and transitions to Timeline should preserve Shared Space context whenever practical.

Living Canvas does not require every interaction to use an overlay or bottom sheet. Full-screen views may be used when content complexity, platform conventions, or accessibility make them clearer. The invariant is continuity of context, not a particular presentation container.

Map and Timeline should preserve selected Pin and relevant filtering state when practical. Timeline items may reveal the same Pin on Map. Motion may reinforce the spatial-temporal relationship, but functionality must remain complete with reduced motion.

---

## Navigation Hierarchy

Map and Timeline are the two primary Shared World perspectives. Map communicates where shared content belongs or happens; Timeline communicates when it happened or will happen.

Our Space / Profile is a secondary management destination. It must remain reachable without being treated as a third product experience equal to Map and Timeline.

The exact navigation component remains a UI design decision. This architecture does not require top segmented navigation or bottom navigation.

---

## Pairing Metaphor: Two Signals

Two independent people connect, form one Shared Space, and begin building their shared world.

Two Signals may guide pairing interaction, motion, visual storytelling, and connection states. It must not introduce additional product behavior or change invitation semantics.

---

## World Style Ownership and Availability

Path, Orbit, and Bloom are available normally. None of these three World Styles is premium-restricted.

World Style belongs to the couple's Shared Space, not to an individual user. The creating partner selects it before invitation generation. The invited partner previews and joins the selected style and does not choose another style independently.

World Style may later be changed from `Profile → Our Space → World Style`. No premium requirement, purchase requirement, change limit, or cooldown applies unless a future approved requirement introduces one.

---

## Path

Concept:

Two individual journeys become one shared path.

Visual language may use:

- connection
- movement
- spatial relationships
- linked places
- progression

Avoid making Path resemble a travel-navigation or destination-discovery product.

---

## Orbit

Concept:

Two people and their places form one shared system.

Visual language may use:

- shared centers
- balance
- relationships between places
- subtle orbital movement

Avoid excessive space, galaxy, sci-fi, or space-game styling.

Orbit must still feel like Pinus.

---

## Bloom

Concept:

The Shared Space grows as memories and experiences accumulate.

Visual language may use:

- progressive growth
- organic expansion
- branching relationships
- evolving shared space

Avoid literal floral, wedding, scrapbook, or overly romantic styling.

Bloom must remain modern and restrained.

---

## Shared Design Foundation

Path, Orbit, and Bloom are not separate products or separate applications.

They share:

- product flow
- navigation architecture
- information hierarchy
- screen responsibilities
- data requirements
- typography and spacing systems
- core component architecture
- accessibility rules
- form behavior
- business logic
- interaction fundamentals

World Styles may affect:

- visual metaphor
- color accents
- map treatment
- Pin presentation
- shared-space illustrations
- motion language
- background and decorative surfaces

World Styles must not change:

- business rules
- required information
- authentication
- invitation semantics
- navigation fundamentals
- accessibility requirements

The same functional screen must not have three unrelated implementations.

---

## Welcome / Login Rule

Welcome / Login always uses Pinus Core.

It must communicate:

Pinus

Your world, together.

A private shared map for two people.

It must not preview one World Style as if it were the default product experience. Path, Orbit, and Bloom must not be presented as choices on this screen.

---

## Source of Truth

Product requirements override visual references.

Reference images define visual direction only.

If a reference image contains unsupported fields, features, security claims, navigation patterns, or product behavior, do not reproduce them.
