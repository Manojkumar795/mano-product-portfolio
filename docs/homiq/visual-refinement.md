# HOMIQ — screenshot feedback refinements

21 October 2026. Scope: the seven areas highlighted by Manoj following visual QA version 251.

1. Research pair: replaced the repeated research boxes with numbered editorial notes. Rebuilt room context as a complete five-step sequence. Both panels now share a title baseline and full-height media box.
2. Audit summaries: replaced repetitive paragraphs with coverage proportions/counts, three navigation destinations and a compact confirmation summary. Counts and qualification of structural depth remain intact.
3. Everyday controller: added 29.59px of artboard-space clearance after the description; aligned Core needs and Setup stages headings, and aligned the first list/bar rows. Removed the unrelated red dash and green sparkle above the bars.
4. Journey: added separation between its subtitle and peak label, and made the title legible against its dark background. Values remain 3, 12, 3 and 2.
5. Information architecture: distinguished destination branches from ordered setup paths, using a tree and three connected stage rows in the same outer panel.
6. Affinity board: removed duplicate headings and the hidden duplicate identity layer; used one title per principle, consistent rules, aligned columns, equal lower cards and labeled palette samples. Existing app colors and source screenshots are retained.
7. Recovery: replaced four disconnected boxes with the connecting/connected happy path, an explicit failure branch and a dashed retry route. Removed the decorative black cursor at the panel bottom. Proposed-state qualification is retained.

## Validation

- Visually reviewed all seven affected areas in the actual local page at 1440 × 900; captures in `outputs/homiq-refinement/01-research.jpg` through `07-recovery.jpg`.
- Exact viewport checks at 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 375×812: no horizontal overflow; all 27 body sections retained; persona heading/first-row alignment differences 0px at every size. The existing uniform canvas scaling remains intact.
- Fourteen revised SVGs rendered at intrinsic dimensions: zero measured text overlaps or out-of-bounds text.
- All 29 current and four earlier PNGs remain byte-identical. Research dataset and source counts remain unchanged. Other projects and shared styling were not modified.
- Production build and artifact validation passed. Existing five-suite regression run: 19 passed, 0 failed.
- Lint on touched TSX: two pre-existing home-link errors in `app/homiq/page.tsx`, plus 25 existing plain-image warnings. No unrelated lint refactor applied.
- Existing geometry fixture hashes updated only for the three intentionally adjusted sections (367, 565, 904) and removal of the faux cursor in the page. All other section and shared CSS checks remain enforced.

Implementation: `scripts/homiq/build-artifacts.py`, its fourteen generated SVGs, `app/homiq/sections/Section367.tsx`, `Section565.tsx`, `Section904.tsx`, and the cursor removal in `app/homiq/page.tsx`. Verification fixture: `tests/fixtures/homiq-layout.json`.
