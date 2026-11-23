Latest visual-only audit: [HOMIQ visual QA and correction report](visual-qa.md).

# HOMIQ verification — inline comparisons and audit content

The latest update places all four earlier/current comparisons directly in the main case study: rooms, device discovery, appliance control and scene intent. There is no research gateway or click-through. Existing research bookmarks redirect to `/homiq`.

The entire case-study copy now uses one methodology note, published source links, screen-audit measurements, a defined visible-evidence rubric and eight proposed success targets. No interviews, participant quotes, survey populations or achieved usability results are invented. [Audit methodology](audit-methodology.md) records operational definitions and external references; [audit-data.json](audit-data.json) lists every counted control and input.

## Presentation and scope

- The same 27 sections, dark editorial palette, green circles, typography and original screen layouts remain. Only the requested comparison section expands: 782 → 2405px, adding 1623px to the canvas and downstream positions. The trailing arrow moves with it.
- The previous research route's separate presentation and unused styles/data were removed.
- All 29 current and four selected earlier PNGs pass SHA-256 integrity checks and appear uncropped in the generated artifacts. Four comparison boards preserve the approved 544×441 media size and 360px reasoning column.
- Original chart rectangles and compositions remain. Values, rubric cells, archetype bar fills and curve points now encode audit evidence.
- `CaseCanvas.tsx` and its responsive scaling/crop remain unchanged. The main portfolio and the other seven projects were not edited.

## Verification

- Production build: `npm run build:local` passed.
- Artifact validation: ESM Worker and hosting manifest passed.
- Regression suite: 19 tests passed, including original screen integrity, baseline geometry outside the authorized expansion, four inline comparisons, legacy-route redirect, audit arithmetic, homepage/project rendering and playground embeds.
- Browser checks at 1280px, 820px and 390px widths: all four rows present, no horizontal document overflow, reasoning contained within each row, no overflowing fixed text blocks. All comparison images loaded. The footer and artboard bottom align.
- Screenshots and measured geometry are in `outputs/homiq-inline/`. A taller desktop viewport was used to capture the continuous stack; responsive scale remains width-based.
- Focused lint: zero errors; two existing-style plain-image optimization warnings in the new comparison component. No dependencies were added. The unrelated repository-wide lint/type issues recorded in the earlier verification remain outside this change.
- React review: the comparisons remain static server-rendered content, keyed by stable IDs. They add no client state, fetch waterfall or event listeners. Images carry descriptive alternatives, intrinsic dimensions and lazy loading. External source links use safe new-tab attributes. The compatibility route uses the framework redirect.

## Measurement limits

Screen counts describe supplied frames; structural depth is inferred from destinations, not an observed runtime tap count. Editable-field counts do not establish validation requirements. The heuristic score measures visible evidence, not usability or accessibility compliance. Sampled color-pair contrast is calculated using WCAG sRGB relative luminance, not a whole-app conformance result. Product targets are explicitly proposed, with completion denominators, timing boundaries, confidence scale and abandonment window documented.
