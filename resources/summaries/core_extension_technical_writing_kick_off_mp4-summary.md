# Summary: core_extension_technical_writing_kick_off_mp4.md
> Source: resources/core_extension_technical_writing_kick_off_mp4.md
> Summarized: 2026-05-06

## Attendees
- **Moshe** (Speaker 1) — Nayax, meeting facilitator
- **Anna** (Speaker 2) — WriteChoice technical writing team
- **Shai** (Speaker 3) — Chief Architect
- **Oleg** (Speaker 4) — Product Manager

## Key Decisions

- Anna will write the Core Extension developer documentation for the Nayax dev zone
- Process: draft structure first → Nayax approves → write content → Nayax approves → publish
- Documentation should focus on **external application development only** (not internal Nayax apps, even though the existing docs cover both)
- Onboarding flow follows the same pattern as other Nayax APIs: welcome email → sandbox setup → developer builds and tests → certification → production deployment
- Configuration in Nayax Core (registering the app, menu items, URL) is done manually by Nayax — developers do not self-register yet

## Action Items

- [ ] Moshe: Send the meeting recording to Anna
- [ ] Moshe: Share the Confluence documentation with Anna (export to PDF/Word if she lacks access)
- [ ] Anna: Check Confluence access; if not available, message Moshe
- [ ] Anna: Review the existing Confluence documentation and send questions by email
- [ ] Anna: Start with the structure/outline of the dev zone page first (before writing content)
- [ ] Oleg/Shai: Define and document the developer onboarding process (code review, security review, legal/commercial agreements)
- [ ] Oleg/Shai: Decide on hosting model — Nayax-provided repo vs. external hosting (currently both supported, decision pending)
- [ ] Moshe: Share the Cortina fiscal Tina links with Marianne Spinner (separate task, unrelated to Core Extension)

## Technical Topics Discussed

**What Core Extension is:**
An SDK/framework that lets external developers embed their own applications into the Nayax back-office (NayaxCore). The concept is analogous to third-party app extensions in Microsoft Teams or Outlook — a developer builds an app, and it appears as a native part of the Nayax backend UI.

**Three extension types:**
1. **Full screen** — the developer app takes over the entire screen; receives user auth token only, no element context
2. **Tab** — embedded as an iFrame tab in an existing screen; receives auth token + the context of the focused element (e.g., which machine is selected)
3. **Button with popup** — a menu button that opens a popup containing the developer app; also receives auth token + focused element context

**Authentication:**
When the extension loads, Nayax passes it a user-context JWT token. The developer app uses this token to make Nayax API calls on behalf of the logged-in user.

**Translations:**
Developers must expose their UI text strings via the translation framework. Nayax Core then manages translations across languages. When a user loads the extension in Danish, they receive text in Danish.

**Role/permission management:**
Developers must expose their UI elements to Nayax's role management system so admins can control which user roles can see which parts of the extension. Works the same way as Nayax's existing permission system.

**Existing documentation:**
An AI-generated draft exists in Confluence. It is internal/raw and not developer-friendly, but contains all the technical information needed as a starting base.

## Open Questions / Blockers

- Is Core Extension a paid add-on for customers? (Moshe indicated it is not out-of-the-box but can be enabled per integration)
- Developer self-registration is not yet possible — the process for submitting an app for Nayax review (code review, security review, legal/commercial agreement) is still being defined
- Hosting decision pending: will Nayax provide a repo, or will external hosting be the primary path?
- Anna does not yet have access to the Confluence documentation
