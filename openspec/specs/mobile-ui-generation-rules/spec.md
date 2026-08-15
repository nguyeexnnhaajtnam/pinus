# mobile-ui-generation-rules Specification

## Purpose

Define a self-contained, testable design contract for generating consistent Pinus mobile interfaces across approved product flows without requiring access to any visual reference.

## Requirements

### Requirement: Product-wide visual direction
Generated Pinus UI SHALL be modern, clean, warm, calm, light-first, highly readable, and recognizably map-first. It SHALL express a private space for exactly two people through restrained shared cues rather than hearts, romantic clichés, or repeated couple portraits, and SHALL NOT resemble a dating app, travel-discovery product, public social network, fantasy experience, scrapbook, postcard, or vintage diary.

#### Scenario: New screen is generated
- **WHEN** a designer or AI generates any approved Pinus mobile screen
- **THEN** the screen uses a light, calm, rounded, low-noise visual language and preserves the private shared-map identity without introducing a prohibited aesthetic

### Requirement: Pinus UI uses a core brand and shared World Style architecture
Pinus UI SHALL consist of Pinus Core Brand and a Shared World Style extension layer. Pinus Core SHALL define the shared typography, spacing, component architecture, accessibility rules, information hierarchy, navigation patterns, forms, and interaction fundamentals used throughout the application. World Style SHALL extend that foundation without replacing it or creating separate versions of the application.

#### Scenario: Equivalent screens use different World Styles
- **WHEN** the same functional shared-space screen is generated for Path, Orbit, and Bloom
- **THEN** all versions preserve the same information, actions, hierarchy, navigation, form behavior, accessibility, and component structure while varying only approved World Style presentation attributes

### Requirement: Shared World uses a Living Canvas experience model
The Shared Space MUST feel like one continuous living environment rather than unrelated modules. The Living Shared Map MUST remain the primary canvas. Pin inspection and transitions between Map and Timeline SHOULD preserve Shared Space context, selected Pin, and relevant filtering state when practical. The UI MAY use overlays, sheets, or full-screen views according to content complexity, platform conventions, and accessibility; Living Canvas MUST NOT require one presentation container.

#### Scenario: Selected Pin moves between perspectives
- **WHEN** a user switches between Map and Timeline while a Pin is selected
- **THEN** the same Pin remains identifiable or selected when practical and the Shared Space context remains clear

#### Scenario: Complex Pin content is inspected
- **WHEN** an overlay would constrain content comprehension or accessibility
- **THEN** the UI may use a full-screen view while preserving a predictable return to the originating Shared Space context

### Requirement: Pinus Core governs the pre-space experience
Welcome / Login, Minimal Profile Setup, and Couple Entry SHALL use Pinus Core and SHALL NOT belong specifically to Path, Orbit, or Bloom. Welcome / Login SHALL communicate `Pinus`, `Your world, together.`, and `A private shared map for two people.` without previewing one World Style as the default product experience or presenting World Styles as choices.

#### Scenario: User reaches Couple Entry before creating or joining a space
- **WHEN** a user progresses through Welcome / Login, Minimal Profile Setup, and Couple Entry without an active shared-space context
- **THEN** every screen uses Pinus Core and does not apply or ask the user to select Path, Orbit, or Bloom

### Requirement: World Style belongs to the shared couple space
Each Shared Space SHALL belong to a couple, represent the private world shared by its two connected users, and have one active World Style selected from Path, Orbit, and Bloom. The creating partner SHALL select the initial World Style before invitation generation. The invitation SHALL retain the selected Shared Space and World Style context. Both partners SHALL experience that same World Style, and the invited partner SHALL NOT independently select a different World Style when joining the space.

#### Scenario: Creating partner selects a World Style
- **WHEN** the creating partner chooses Path, Orbit, or Bloom for a new shared space
- **THEN** that selection becomes the shared space's World Style and carries into its invitation, pairing states, and Shared Map

#### Scenario: Invited partner previews the invitation
- **WHEN** the invited partner loads an invitation for a shared space
- **THEN** the UI previews the World Style already assigned to that shared space and offers no control for selecting a different style

#### Scenario: Invitation is generated after style selection
- **WHEN** the creating partner generates an invitation
- **THEN** the invitation represents the Shared Space and World Style selected before generation

### Requirement: Couple onboarding follows the approved style boundary
The creation flow SHALL progress through Welcome / Login, Minimal Profile Setup, Couple Entry, Create Our Space, Choose World Style, Generate Invitation, Pairing / Waiting, Connection Success, and Living Shared Map. The joining flow SHALL progress through Welcome / Login, Minimal Profile Setup, Couple Entry, Enter Invitation Code, Load Invitation / Shared Space, Preview Selected World Style, Accept Invitation, Connection Success, and Living Shared Map. World Style SHALL begin when the creating user enters Shared Space creation and at the resolved invitation preview for the joining user; unresolved invitation loading and error states SHALL remain Pinus Core.

#### Scenario: User creates a shared space
- **WHEN** a user chooses Create Our Space from Couple Entry
- **THEN** the flow requests a World Style before invitation generation and consistently applies the chosen style from the themed creation and pairing experience into Living Shared Map

#### Scenario: User joins a shared space
- **WHEN** a user submits an invitation code from Couple Entry
- **THEN** the flow loads the invitation in Pinus Core, previews the invited World Style when resolved, and carries that same style through acceptance, Connection Success, and Living Shared Map

### Requirement: Pairing uses shared architecture with themed presentation
Choose World Style, Invite Partner, Invitation Preview, Pairing / Waiting, and Connection Success SHALL respond to the applicable World Style while retaining one shared functional screen architecture. These screens SHALL use Two Signals as the product-level pairing metaphor: two independent people connect, form one Shared Space, and begin building their shared world. World Style MAY control selected colors, visual metaphor, hero treatment, motion, background decoration, and spatial effects, but Two Signals and World Style SHALL NOT change available actions, content requirements, validation, permissions, invitation semantics, navigation, or state transitions.

#### Scenario: Pairing screen is rendered in each World Style
- **WHEN** Choose World Style, Invite Partner, Invitation Preview, Waiting for Partner, or Connection Success is generated for Path, Orbit, and Bloom
- **THEN** each rendering preserves the same functional structure and behavior and differs only through the approved presentation extension points

#### Scenario: Two Signals is used in a connection transition
- **WHEN** pairing motion or visual storytelling represents two people connecting
- **THEN** it communicates formation of one Shared Space without adding a new action, state, rule, or guarantee

### Requirement: World Style concepts guide presentation without changing behavior
Path SHALL express two individual journeys becoming one shared path. Orbit SHALL express two people becoming part of one shared system. Bloom SHALL express a shared world growing as the relationship accumulates memories and experiences. These concepts SHALL influence visual behavior only and SHALL NOT introduce style-specific features, workflows, data, permissions, or navigation.

#### Scenario: A World Style concept influences a shared-space screen
- **WHEN** a style metaphor is applied to hero imagery, decorative composition, motion, map treatment, or spatial effects
- **THEN** the result remains recognizably Pinus and exposes exactly the same product functionality as the other World Styles

#### Scenario: Path is applied
- **WHEN** Path influences a Shared World screen
- **THEN** it uses connection, movement, linked places, spatial relationships, or progression without resembling travel navigation or destination discovery

#### Scenario: Orbit is applied
- **WHEN** Orbit influences a Shared World screen
- **THEN** it uses shared centers, balance, place relationships, or subtle orbital movement without excessive sci-fi, galaxy, or space-game styling

#### Scenario: Bloom is applied
- **WHEN** Bloom influences a Shared World screen
- **THEN** it uses progressive growth, organic expansion, branching relationships, or evolving surfaces without literal floral, wedding, scrapbook, or overly romantic styling

### Requirement: Approved World Styles and switching are normally available
Path, Orbit, and Bloom SHALL be available without premium restriction. An existing Shared Space SHALL allow its active World Style to be changed from `Profile → Our Space → World Style` when Shared Space settings are available. The UI SHALL NOT introduce premium-only switching, purchase requirements, change-count limits, or cooldown periods without a future approved requirement.

#### Scenario: Couple opens World Style settings
- **WHEN** a connected user opens `Profile → Our Space → World Style`
- **THEN** Path, Orbit, and Bloom are available as Shared Space style options without premium locks or invented switching restrictions

#### Scenario: Active World Style changes
- **WHEN** the Shared Space's active World Style is changed
- **THEN** both partners subsequently experience the same updated style while product functionality and shared content remain unchanged

### Requirement: Semantic design token foundation
Generated UI SHALL consume named semantic tokens rather than screen-specific colors or arbitrary measurements. The token foundation SHALL include calm teal or mint brand actions, orange Plan accents, purple Secret accents, yellow or amber Time Capsule accents, neutral off-white surfaces, dark high-contrast text, success, warning, error, disabled, focus, overlay, border, spacing, radius, elevation, icon, and typography roles. Memory SHALL use the primary teal family unless an owner-approved brand update replaces it.

#### Scenario: Components are generated across flows
- **WHEN** equivalent components or Pin states appear on different screens
- **THEN** they resolve through the same semantic color, spacing, typography, radius, elevation, and state tokens rather than unrelated local styling

### Requirement: Token scales remain restrained and reusable
Generated UI MUST use restrained semantic spacing, radius, and elevation roles shared across Pinus Core and every World Style. Related content MUST remain visibly grouped, sections MUST remain distinct, and component shapes MUST NOT establish unrelated visual systems. Shadows SHOULD remain restrained and communicate functional elevation or separation. Exact production measurements remain a later UI-system decision.

#### Scenario: A new component needs spacing and shape values
- **WHEN** a component is added to the Pinus UI system
- **THEN** its spacing, radius, and elevation use the shared scales and do not introduce a visually redundant one-off value without documented justification

### Requirement: Typography and iconography hierarchy
Typography MUST use legible semantic roles that clearly distinguish screen title, section title, body, label, helper, and metadata. Text MUST remain readable at supported platform scaling. Exact production font family, weight, and size values remain later design-system decisions. Icons MUST use one coherent family; icon-only actions MUST include accessible labels and MUST NOT rely on decorative illustration to communicate core actions.

#### Scenario: Content hierarchy is reviewed
- **WHEN** a generated screen contains titles, body copy, metadata, and actions
- **THEN** users can identify the screen purpose, primary content, and primary action through typography and icon treatment without relying only on color

### Requirement: Reusable component language
Primary buttons SHALL be high-contrast teal or mint-accented controls with clear active, pressed, loading, disabled, and focus states; each screen SHALL normally expose one visually dominant primary action. Secondary actions SHALL use outlined, tonal, or text treatment. Inputs SHALL have persistent labels, clear boundaries, helper and error areas, and visible focus. Cards, empty states, sheets, modals, chips, and tags SHALL share the token system, rounded geometry, restrained density, and minimal shadow usage. Destructive actions SHALL use the semantic error treatment and SHALL never be styled as a routine primary action.

#### Scenario: Component states are generated
- **WHEN** a button, input, card, chip, modal, or sheet can be inactive, selected, loading, invalid, or disabled
- **THEN** every applicable state is visibly distinguishable, accessible, and consistent with the corresponding component elsewhere in the app

### Requirement: Navigation is shallow and predictable
Map and Timeline MUST be presented as the two primary Shared World perspectives. Our Space / Profile MUST remain a reachable secondary management destination and MUST NOT be presented as a third product perspective equal to Map and Timeline. Navigation MUST preserve platform-appropriate back behavior, keep Create Pin readily reachable from Map, and avoid duplicate destinations. The exact navigation component MAY evolve during UI design; this specification does not require top segmented or bottom navigation.

#### Scenario: Navigation is generated for a core flow
- **WHEN** a screen belongs to Map, Timeline, Profile, or a nested create/detail flow
- **THEN** the user can identify the current destination, return predictably, and reach the primary action without conflicting top and bottom navigation

### Requirement: Entry and onboarding screen structure
Welcome / Login SHALL use Pinus Core, present the Pinus value proposition, private two-person scope, map-first purpose, and one primary continuation action without unsupported privacy or security promises. Sign-in SHALL expose only owner-approved authentication providers and SHALL currently present Google and Apple without email/password, username/password, or phone OTP fields. Minimal Profile Setup and Couple Entry SHALL remain Pinus Core. Minimal Profile Setup SHALL request only approved essential fields, clearly distinguish optional data, explain any public or partner-visible data truthfully, and retain one primary continuation action. Couple Entry SHALL provide the approved create-space and join-space paths without presenting World Style choices until the creating user enters the creation flow or the joining user's invitation has resolved.

#### Scenario: Entry flow is generated
- **WHEN** Welcome / Login, Minimal Profile Setup, or Couple Entry is generated
- **THEN** the screens form a concise Pinus Core progression, use only approved authentication and profile inputs, make the next action unambiguous, and do not prematurely apply or request a World Style

### Requirement: Couple connection screen structure
Couple Entry SHALL present the create-space and enter-code paths in Pinus Core. Invite Partner SHALL provide a readable invitation code or share action, privacy-appropriate explanatory copy, and invitation status without implying unsupported guarantees. Invitation Preview SHALL display the invited shared space's World Style before acceptance. Waiting for Partner SHALL keep the invitation status and cancel or retry actions available without simulated progress. Connection Success SHALL communicate that two people now share one private space, provide one action into the map, and avoid confetti, wedding imagery, or exaggerated romantic celebration. The themed pairing screens SHALL preserve the shared functional architecture and use only the World Style assigned to their shared-space context.

#### Scenario: Couple connection state changes
- **WHEN** the user moves from invitation creation or preview through waiting or acceptance to successful connection
- **THEN** each screen clearly communicates the current state, available action, and transition into the shared map while consistently applying the shared space's World Style after it becomes available

### Requirement: Shared map remains the primary product surface
The Living Shared Map SHALL be the primary representation of the couple's Shared Space and SHALL progressively represent their accumulated shared places, moments, future intentions, and location- or time-based Pin content. It SHALL preserve geographic readability, familiar pan and zoom affordances, unobscured important map content, clear Pin inspection, and a prominent create-Pin action. Empty Map SHALL explain that the private map contains only the couple's content and guide creation of the first Pin without displaying public discovery points. Populated Map SHALL distinguish Pin types and selected, clustered, locked, and default states while keeping labels and controls legible. The map SHALL NOT behave as a generic location browser or include restaurant discovery, nearby recommendations, hotels, tourism content, partner-distance tracking, or continuous partner-location UI.

#### Scenario: Empty and populated maps are compared
- **WHEN** no Pins exist and later multiple Pin types exist
- **THEN** the map remains geographically understandable in both states, the empty state guides first creation, and the populated state supports Pin inspection without public-discovery patterns

### Requirement: Pin types form one visual family
The current Pin family MUST contain only Memory, Plan, Secret, and Time Capsule. These types MUST share a common marker silhouette, component proportions, typography, label placement, and interaction behavior. They MUST differ through a redundant combination of semantic color and a unique icon or internal symbol: Memory uses the primary teal family and a memory symbol, Plan uses orange and a future-intent symbol, Secret uses purple and a location-lock symbol, and Time Capsule uses amber and a time-lock symbol. Color MUST NOT be the only differentiator. The same type identity MUST persist across map markers, chips, creation selectors, timeline rows, lock states, and details.

#### Scenario: One Pin appears in several contexts
- **WHEN** a Pin is shown on the map, in the creation flow, in Timeline, and in its detail view
- **THEN** its type remains immediately recognizable through consistent semantic color, icon, label, and state treatment

### Requirement: Pin creation preserves context and simplicity
Create Memory, Plan, and Secret flows SHALL clearly retain or summarize the chosen geographic location, identify the selected Pin type, use persistent field labels, minimize required fields, separate optional fields, provide clear media handling where approved, and expose one primary save action. Memory SHALL prioritize occurred date, title, note, and optional media; Plan SHALL prioritize title, location, optional target date, and note; Secret SHALL communicate location-based locking without revealing locked content. Time Capsule creation rules SHALL be added only when its approved creation flow is in scope. Forms SHALL NOT resemble dense enterprise data-entry screens.

#### Scenario: A user creates a Pin
- **WHEN** the user selects a location and creates a Memory, Plan, or Secret
- **THEN** the screen preserves location context, requests only type-relevant data, distinguishes optional values, validates clearly, and presents one dominant save action

### Requirement: Pin details prioritize meaning and provenance
Pin Detail SHALL lead with the Pin's title and relevant media, then show type, location, date or target condition, note, creator attribution when approved, and available edit or delete actions according to product permissions. Metadata SHALL remain concise and scannable, destructive actions SHALL be separated from routine actions, and unavailable or broken media SHALL have a stable fallback.

#### Scenario: A Pin detail is opened
- **WHEN** a user opens a Pin from Map or Timeline
- **THEN** the detail preserves the same type identity and presents meaningful content before metadata and management actions

### Requirement: Timeline represents the temporal view of the shared map
Timeline MUST be the temporal view of the same Shared Space Pins represented spatially by the Living Shared Map. It SHOULD use a compact, scannable hierarchy such as Year → Month → Pin moments rather than large social-feed cards by default. Timeline MAY include past Memories, future Plans, and locked, upcoming, ready, or unlocked Secret and Time Capsule entries. It MUST preserve Pin identity, type, selected state where practical, relevant filtering context, canonical detail destinations, and protected-content rules. It MUST NOT use an independent content model or behave as a public or social feed, and MUST NOT include likes, followers, public comments, engagement counts, or feed-ranking cues.

#### Scenario: Couple history is browsed
- **WHEN** users browse multiple months or years of Pins
- **THEN** entries are chronologically grouped, visually linked to map Pin types, concise enough to scan, and free of public-social mechanics

#### Scenario: Timeline Pin is revealed on Map
- **WHEN** a user chooses Reveal on Map for a Timeline item
- **THEN** Map focuses or identifies the same Pin while preserving Shared Space context

#### Scenario: Protected Pin appears in Timeline
- **WHEN** a Secret or Time Capsule is locked, upcoming, ready, or unlocked
- **THEN** Timeline communicates the truthful state and does not reveal protected content before authorization

### Requirement: Secret lock states protect unavailable content
A locked Secret SHALL communicate that content is private and location-locked, show only approved non-sensitive metadata, never preview the hidden note or media, and provide only actions supported by the approved location-check flow. An unlocked Secret SHALL reveal content using the standard Pin-detail hierarchy and preserve a visible Secret type cue. Copy and transition treatment SHALL feel calm and anticipatory, not game-like, punitive, or treasure-hunt themed.

#### Scenario: Secret is viewed before and after unlock
- **WHEN** the location condition is unsatisfied and later verified as satisfied
- **THEN** the locked view discloses no protected content and the unlocked view transitions to the normal Secret detail with an understandable state change

### Requirement: Time Capsule lock states communicate time truthfully
A locked Time Capsule SHALL show that content remains unavailable until the approved unlock time, may show the exact unlock date or a truthful time status, SHALL NOT expose protected note or media, and SHALL NOT offer early opening unless owner-approved behavior permits it. A ready or unlocked Time Capsule SHALL clearly communicate availability and reveal content through the standard detail hierarchy. Styling SHALL use restrained amber time cues without gift boxes, magical particles, birthday graphics, or false countdown precision.

#### Scenario: Time Capsule reaches its unlock time
- **WHEN** a Time Capsule changes from locked to server-authorized ready or unlocked state
- **THEN** the UI changes from protected time messaging to a clear available state without exposing content early or implying unsupported early access

### Requirement: Profile and couple settings are structured and restrained
Profile or Shared Space Settings SHALL show identity and relationship information approved for display, organize account, Shared Space, notification, privacy, session, and data actions into clear sections only when those capabilities exist, and separate destructive actions such as unlink or logout. `Our Space → World Style` SHALL expose the active shared style and the approved switching behavior when that setting is implemented. Settings SHALL use the same core typography, navigation, component language, and active World Style presentation as map and content flows and SHALL NOT become a relationship analytics dashboard.

#### Scenario: Settings screen is generated
- **WHEN** Profile or Couple Settings is displayed
- **THEN** only supported settings appear, related actions are grouped, destructive actions are clearly distinguished, and no scores, streaks, counters, or analytics are invented

### Requirement: Forms provide clear validation and asynchronous states
Create and edit forms SHALL preserve user-entered values during recoverable failures, place validation feedback next to the affected field, distinguish required from optional inputs, and expose deterministic loading, success, disabled, and retry states. Location, date, time, and media controls SHALL communicate their current value and permission or upload status. Secondary actions SHALL remain visually subordinate to the single primary submit action.

#### Scenario: Form submission fails recoverably
- **WHEN** validation, media upload, or network submission fails without invalidating the user's data
- **THEN** entered values remain available, the affected state is explained near its source, and the user can correct or retry without duplicate submission

### Requirement: Content voice is warm, private, and concise
User-facing copy SHALL be warm, intimate, calm, trustworthy, concise, and specific to the current state. It SHALL avoid childish language, exaggerated romance, corporate or promotional phrasing, gamification, guilt, and claims about privacy, encryption, delivery, location accuracy, or unlock behavior that are not established by approved requirements. Labels SHALL favor plain actions over metaphor when the metaphor could obscure behavior.

#### Scenario: Microcopy is generated
- **WHEN** an AI generates a title, helper message, empty state, lock explanation, error, or CTA
- **THEN** the copy states what is happening and what the user can do in the approved Pinus tone without unsupported promises or decorative verbosity

### Requirement: Accessibility and usability minimums
Interactive touch targets SHALL be at least 44 by 44 logical pixels, normal text and essential icons SHALL meet at least WCAG AA contrast, and information SHALL NOT depend on color alone. Focus, selected, disabled, loading, success, warning, error, locked, and unlocked states SHALL remain distinguishable through text, shape, icon, or border changes. Screens SHALL support platform text scaling, readable input labels, keyboard-safe primary actions, screen-reader names, and reduced-motion behavior for nonessential animation.

#### Scenario: Generated UI is accessibility-reviewed
- **WHEN** a generated flow is evaluated at supported text scaling and with color removed as the sole cue
- **THEN** content remains readable, controls remain operable, state remains understandable, and touch targets meet the minimum size

### Requirement: AI generation remains consistent and in scope
Future AI-generated UI SHALL use this specification as the primary visual and interaction contract, reuse established tokens and components, preserve one product identity across onboarding, connection, map, creation, timeline, lock states, and settings, and flag any requested departure that changes product scope or an owner decision. It SHALL NOT invent chat, calls, public feeds or profiles, followers, likes, public comments, live partner tracking, distance tracking, discovery or tourism features, recommendations, games, scores, streaks, calendars, task management, marketplaces, AI assistants, additional authentication methods, privacy guarantees, or unrelated visual metaphors.

#### Scenario: Prompt requests an unsupported addition or aesthetic drift
- **WHEN** AI-assisted generation is asked to add an unapproved feature, conflicting navigation system, inconsistent Pin metaphor, or unrelated visual direction
- **THEN** generation excludes the addition, preserves the approved contract, and identifies the product-owner decision needed before such a change

### Requirement: Product-owner decisions remain explicit
Final logo direction, a change to the default typography family, a major navigation-architecture change, a new World Style, future monetization of additional styles or treatments, changes to the approved Path, Orbit, and Bloom architecture, changes to Pin semantics, and any change to product scope SHALL require product-owner approval. Path, Orbit, Bloom, and switching among them SHALL NOT be treated as unresolved premium or entitlement decisions. Generated UI MAY refine reversible layout, proportion, interaction, World Style presentation, motion, accessibility, and responsive details while staying within these requirements.

#### Scenario: Generation encounters an owner-level decision
- **WHEN** a requested design would determine or alter a reserved brand, navigation, theme, Pin, privacy, security, or product-scope decision
- **THEN** the artifact records the unresolved decision for owner review and does not silently encode it as approved behavior

### Requirement: This capability defines rules rather than implementation assets
This change SHALL NOT implement Flutter UI, backend logic, APIs, persistence, production visual assets, a final logo, or a complete brand identity system, and SHALL NOT redesign the Pinus product concept or add features outside approved scope.

#### Scenario: Change artifacts are completed
- **WHEN** the change is reviewed for implementation readiness
- **THEN** it contains reusable textual UI rules and validation work only, with no runtime application or backend implementation presented as part of this change
