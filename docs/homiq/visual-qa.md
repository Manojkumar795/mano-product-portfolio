# HOMIQ — visual QA and correction report

Date: 21 October 2026. Scope: visual implementation defects only. Approved baseline: existing running HOMIQ page and published version 250, source commit 31623df71940741d8a21a4ae049b4af7f24dd8b9.

## Inspected scope

All 29 top-level rendered areas were inspected individually (white hero, 27 body sections and footer), including all four inline comparison rows. Forty overlapping desktop viewport captures cover long panels as well as compact sections. The page was measured at all seven requested viewport dimensions. All 57 generated SVGs were additionally rendered at their intrinsic dimensions in a temporary, read-only asset QA page; 481 text labels were measured with actual browser bounds.

| # | Rendered area | Result |
|---:|---|---|
| 1 | homiq-hero | Inspected; unchanged |
| 2 | Overview | Inspected; unchanged |
| 3 | Our Vision | Inspected; unchanged |
| 4 | The Process | Inspected; unchanged |
| 5 | Initial Problem Discovery | Inspected; unchanged |
| 6 | Research illustrations | QA-04 fixed |
| 7 | Problem statement | QA-01 fixed |
| 8 | Desk Research | QA-02 fixed; research circles unchanged |
| 9 | Competitor Analysis | Inspected; unchanged |
| 10 | User Research Framework | High-priority internal audit passed; unchanged |
| 11 | User Pain Points | Inspected; unchanged |
| 12 | User Personas | Inspected; unchanged |
| 13 | User Journey | QA-03 fixed |
| 14 | Developing a Solution | Inspected; unchanged |
| 15 | Moodboard & Affinity | Inspected; unchanged |
| 16 | Low-Fidelity | Inspected; unchanged |
| 17 | Mid-Fidelity | Inspected; unchanged |
| 18 | High-Fidelity | High-priority internal audit passed; unchanged |
| 19 | Design Decisions | All four inline rows inspected; unchanged |
| 20 | Design Decision: Color | Inspected; unchanged |
| 21 | Color research | Inspected; unchanged |
| 22 | Color palette | Inspected; unchanged |
| 23 | Empty States & Recovery | Inspected; unchanged |
| 24 | Design System | High-priority internal audit passed; unchanged |
| 25 | Product Sequences | High-priority internal audit passed; unchanged |
| 26 | Validation Plan & Intended Outcomes | Inspected; unchanged |
| 27 | My Key Takeaways | Inspected; unchanged |
| 28 | Reflection by Manoj | Inspected; unchanged |
| 29 | homiq-footer | Inspected; unchanged |

## Confirmed defects, root causes and corrections

| ID | Severity | Before / root cause | After / localized correction | Evidence |
|---|---|---|---|---|
| QA-01 | P0 | Problem statement: Paragraph 3:901 uses leading-[0] without child spans providing line-height; its two lines paint at the same vertical position. | Apply the established 21.6px paragraph line-height only to this paragraph; preserve its 1002px column and the 42px section. | baseline-s07-1.jpg |
| QA-02 | P1 | Research & Discovery: First bullets 3:268 and 3:289 use whitespace-nowrap and no 378px text width. The source citation reaches into the neighboring column; the right first bullet also exceeds its own text column. | Give both first bullets the same 378px wrapping width as the remaining items. Keep list positions, font, color, section height and circle geometry. | baseline-s08-1.jpg |
| QA-03 | P1 | User Journey: Plot y=35 occupies the existing header area; value 12 intersects the title. Endpoints at x=0 and x=874 clip half of each 5px marker. | Reserve the same 88px header band used by other charts and a 6px horizontal marker inset. Keep all values, fonts, colors, outer dimensions and curve topology. | baseline-s13-1.jpg; baseline-svg-bounds.json |
| QA-04 | P2 | Problem & Discovery / room-context illustration: Two hardcoded connector endpoints reach x=493 in a 492px-wide SVG and are cut by the viewport edge. | Clamp only those endpoints to canvas width minus 2px, including stroke clearance. Preserve nodes, labels and connectors. | baseline-s06-1.jpg; measured graphics bounds |

The problem-statement paragraph now renders as two normal lines. Both first research bullets wrap in the same 378px text column used by subsequent items; the list flow grows within its existing reserved area. The journey title and method caption retain their original positions, while plot values remain 3, 12, 3 and 2 below a reserved 88px heading band. Markers have a 6px edge inset. Only the two overflowing context-connector endpoints were shortened, by 3px.

## Files modified

Website implementation:

- `app/homiq/sections/Section899.tsx`: one paragraph line-height class.
- `app/homiq/sections/Section251.tsx`: wrapping/width classes on two first list items.
- `scripts/homiq/build-artifacts.py`: localized journey plot margins and context-connector endpoint clamp.
- `public/homiq/artifacts/470-imgIcon.svg`: regenerated journey SVG with identical text, values, colors and outer dimensions.
- `public/homiq/artifacts/904-imgImage1.svg`: regenerated context SVG with the same nodes and labels.

Verification/documentation:

- `tests/homiq-case-study.test.mjs`: baseline-signature normalization limited to the three explicitly corrected paragraph classes; all unrelated geometry remains strictly checked.
- `docs/homiq/visual-qa.md`: this report.
- `docs/homiq/verification.md`: link to this current visual audit.

No shared CSS, CaseCanvas scaling/crop equations, header/footer, source PNG, content map, audit dataset or other portfolio project changed. SHA-256 checks confirm all 29 current and four earlier source PNGs are identical. Fifty-five of 57 generated SVGs remain byte-identical. All 57 SVG text inventories match the baseline.

## Responsive and geometry regression

| Viewport | Areas inspected | Loaded images | Section/image position or size change | Horizontal overflow |
|---|---:|---:|---:|---|
| 1920 × 1080 | 29 | 92 / 92 | 0px | None |
| 1440 × 900 | 29 | 92 / 92 | 0px | None |
| 1280 × 800 | 29 | 92 / 92 | 0px | None |
| 1024 × 768 | 29 | 92 / 92 | 0px | None |
| 768 × 1024 | 29 | 92 / 92 | 0px | None |
| 390 × 844 | 29 | 92 / 92 | 0px | None |
| 375 × 812 | 29 | 92 / 92 | 0px | None |

All native text content, font families, sizes and weights match the approved baseline. The one intentional line-height correction is isolated to paragraph 3:901. Section order, section heights, margins, image/mockup rectangles, existing crop behavior and footer boundary are identical at every requested size. No clipped native text remains. SVG measurement finds zero label overlaps or label overflow, and no corrected marker/connector extends outside its SVG.

The initial local baseline audit covered all seven sizes. A later capture pass revealed that the viewport override had targeted a different open QA tab; those mislabeled captures were discarded. Full loaded-asset baselines were re-captured from the unchanged published v250 at verified exact dimensions, then compared with the corrected local page at the same dimensions. The original local per-section baseline captures and initial geometry also support the defect evidence.

## Pixel and asset comparison

Forty matching 1920 × 1080 per-section/tile screenshot pairs were compared using read-only image decoding. Thirty-four pairs have no changes above a 24-channel JPEG compression tolerance. The six changed tiles contain only the four corrected regions or their adjacent-section continuation. No unexpected visual regions changed. This is backed by exact zero-delta DOM geometry and unchanged source hashes, rather than a claim of exact JPEG byte equality.

Every displayed image path resolves. Gallery phone sizes, gaps, aspect ratios, caption baselines and contain-preserving embedded screenshots match baseline. Original circles, montage spacing and uniform mobile canvas scaling were retained. Existing duplicate montage layers are occluded in the approved composition and do not produce a visible duplicate; they were left alone.

## Build, lint and checks

- `npm run build:local`: passed (production site plus existing playground embeds).
- `bash scripts/validate-artifact.sh`: passed.
- Existing Homiq, research, rendered-HTML and playground regression suites: **19 passed, 0 failed**.
- Focused lint on changed TSX/test files: **0 errors, 1 existing plain-image optimization warning**.
- Full repository lint with generated QA outputs excluded: **56 existing errors, 110 warnings**. This matches the pre-existing error count documented before this task. No unrelated lint fixes were applied.
- Static React review: no new state, effects, event listeners, dependencies or data fetching; the edits affect existing server-rendered paragraphs and SVG coordinates only.

## Remaining limits

No unresolved confirmed overlap, clipping, overflow or asset-loading defects remain in the inspected scope. The approved mobile experience still uniformly scales the desktop composition, including small captions; changing that presentation would exceed this no-redesign brief. This visual audit does not assert whole-app accessibility conformance or change any product/research claims.

Baseline/final screenshots, geometry JSON, defect records, SVG measurements, pixel comparisons and command logs are retained in `outputs/homiq-visual-qa/` (ignored QA outputs, not shipped website content).
