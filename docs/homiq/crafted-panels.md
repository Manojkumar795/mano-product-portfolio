# HOMIQ — focused design and readability rework

21 October 2026. This update responds to five screenshots and the request for expanded Outcomes & Next Steps, following published v252.

## Changes

1. **Navigation audit card:** matches the visual language of its two neighboring cards with a large count, three readable root destinations and a concise room-based path. Removed the tab-like boxes. Coverage and feedback cards remain unchanged.
2. **Information architecture:** replaced the compact text tree with a live layout using the actual Home, Rooms and Profile screens, clear destination purposes and an explicit Rooms → appliance list → device control path. Preserved the distinction between structural depth and unverified tap counts.
3. **Scene/account explanation:** replaced overlapping, undersized image notes with two readable panels. The original scene-name screen illustrates the difference between naming, membership and state. The account panel explains editable name / locked email and the email → code → password recovery sequence, plus the checks still needed.
4. **Shared control pattern:** completely replaced the large green presentation card with a white editorial panel. Room, device, state and action have distinct icons, examples and plain-language explanations. The illustration now explains the relationship instead of filling space.
5. **Low-Fidelity:** rebuilt as live HTML with four consistent structural wireframes and readable task descriptions. Device onboarding and scene creation use numbered vertical paths with one clear explanation per stage. The source app screens are not redrawn or replaced.
6. **Outcomes & Next Steps:** expanded to four detailed project learnings and six concrete next actions. Counts are traceable to the existing audit. Usability studies, event instrumentation and accessibility reviews are described as future work, not claimed results.

## Readability and flow

The redesigned native panels use body text with a physical rendered minimum of 16px at the tested sizes. On narrower viewports their columns stack; detailed paragraphs are no longer scaled into fixed artwork slots. The earlier unchanged artwork sections keep their approved composition.

Four affected sections now use natural content height. CaseCanvas observes that height so subsequent sections and the footer follow expanded content without clipping. The original scale/crop equations and the original CSS rules remain unchanged; new rules are scoped to HOMIQ and the redesigned panels.

## Verification

- Actual browser sizes: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 375×812.
- All 27 body sections retained, in the same order.
- No horizontal overflow, overlapping section boundaries or overflowing text in the redesigned panels.
- Minimum rendered body text: 17px at 1920; 16px at all remaining sizes (rounding tolerance <0.0001px). Structural mockup UI and small metadata labels use their own illustrative type sizes.
- All four wireframe contents fit inside their frames at every tested size. Minimum home-indicator clearance ranges from 12.9 to 20.5 screen pixels.
- Footer and canvas bottom agree within 0.3 screen pixels, attributable to layout rounding.
- No browser error logs in the reviewed local session.
- Production build and artifact validation passed. Five existing regression suites: 19 passed, 0 failed.
- Focused lint on native panels, changed section components and CaseCanvas: 0 errors, 15 plain-image optimization warnings. Local source images are intentionally retained.
- All 29 current and four earlier PNGs are byte-identical to v252. Audit data is byte-identical. Only the navigation card changed among the 57 generated SVGs.
- No other portfolio project or shared cross-project stylesheet changed.

## Implementation

- `app/homiq/components/CraftedPanels.tsx`: native architecture, account/scene notes, context pattern and wireframe/task boards.
- `app/homiq/sections/Section530.tsx`, `Section565.tsx`, `Section639.tsx`, `Section675.tsx`: targeted composition and content updates.
- `app/homiq/homiq.css`: scoped typography, spacing, grid and breakpoint rules.
- `app/homiq/page.tsx`: natural-flow wrappers for the four expanded sections.
- `app/homiq/CaseCanvas.tsx`: observe actual artboard height and keep the canvas synchronized.
- `scripts/homiq/build-artifacts.py`, `public/homiq/artifacts/342-imgImage7.svg`: navigation-card refinement; retained dimensions for unused legacy catalog artwork.
- `tests/fixtures/homiq-layout.json`: updated snapshots for the explicitly redesigned sections, page wrappers and HOMIQ CSS. Other section signatures remain enforced.
- `tests/homiq-case-study.test.mjs`: count section elements with an additional layout class as well as the original class.

Final screenshots, viewport geometry, tests and build logs are retained in `outputs/homiq-crafted/`.
