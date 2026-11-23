# HOMIQ editorial cleanup — 22 October 2026

Removed redundant section eyebrows, hero credit and construction footnote, card tags, decorative insight and review numbering, duplicate captions, screenshot provenance narration and internal generation tuples in image descriptions. Footer navigation grouping labels remain, in sentence case. Functional product UI text, workflow sequence markers, metric counts and sources remain.

Preserved all 27 case-study sections in the same order. Surviving positioned elements retain their classes and styles. Product images and non-text SVG graphics are unchanged. Only the background belonging to the removed duplicate mid-fidelity caption was deleted. Local CSS removes first-heading margins previously attached to deleted labels and centers insight text after decorative numbering is removed. Global typography, colors, spacing tokens, breakpoints, hero motion and navigation are unchanged.

Qualifications retained: proposed success targets, proposed recovery flow, design archetypes rather than interviewed participants, screen-based typography estimates, a defined 0–8 interface rubric rather than usability scores, and the limited scope of the 16.4:1 sampled contrast measurement.

Build, artifact validation and all 19 existing tests pass. Desktop and mobile browser comparisons were saved in outputs/homiq-editorial. A source and asset preservation check confirms no unrelated portfolio source changes, no changes to surviving positioned elements, and no changes to image or chart graphics. Layout fixture signatures were updated only for removed editorial nodes; two copy expectations were updated to the shorter audit/target labels.

## Modified application and asset files

- app/homiq/homiq.css
- app/homiq/page.tsx
- app/homiq/sections/Section530.tsx
- app/homiq/sections/Section733.tsx
- app/homiq/sections/Section720.tsx
- app/homiq/sections/Section251.tsx
- app/homiq/sections/Section657.tsx
- app/homiq/sections/Section7.tsx
- app/homiq/sections/Section342.tsx
- app/homiq/sections/Section435.tsx
- app/homiq/sections/Section807.tsx
- app/homiq/sections/Section823.tsx
- app/homiq/sections/Section639.tsx
- app/homiq/sections/Section149.tsx
- app/homiq/sections/Section565.tsx
- app/homiq/sections/Section367.tsx
- app/homiq/sections/Section774.tsx
- app/homiq/sections/Section833.tsx
- app/homiq/sections/Section470.tsx
- app/homiq/sections/Section328.tsx
- app/homiq/sections/Section675.tsx
- app/homiq/sections/Section884.tsx
- app/homiq/sections/Section919.tsx
- app/homiq/sections/Section75.tsx
- app/homiq/components/CraftedPanels.tsx
- app/homiq/components/ResearchPanels.tsx
- app/homiq/components/ProductFilm.tsx
- public/homiq/artifacts/342-imgImage10.svg
- public/homiq/artifacts/565-imgImage.svg
- public/homiq/artifacts/565-imgImage5.svg
- public/homiq/artifacts/565-imgImage4.svg
- public/homiq/artifacts/807-imgImage2.svg
- public/homiq/artifacts/342-imgImage5.svg
- public/homiq/artifacts/565-imgImage6.svg
- public/homiq/artifacts/733-scenes.svg
- public/homiq/artifacts/342-imgImage4.svg
- public/homiq/artifacts/807-imgImage1.svg
- public/homiq/artifacts/565-imgImage2.svg
- public/homiq/artifacts/342-imgImage1.svg
- public/homiq/artifacts/823-imgImage.svg
- public/homiq/artifacts/342-imgImage3.svg
- public/homiq/artifacts/565-imgImage1.svg
- public/homiq/artifacts/342-imgImage2.svg
- public/homiq/artifacts/328-imgImage.svg
- public/homiq/artifacts/807-imgImage.svg
- public/homiq/artifacts/733-discovery.svg
- public/homiq/artifacts/774-imgImage.svg
- public/homiq/artifacts/733-imgImage.svg
- public/homiq/artifacts/342-imgImage9.svg
- public/homiq/artifacts/798-imgImage.svg
- public/homiq/artifacts/720-imgImage.svg
- public/homiq/artifacts/733-climate.svg
- public/homiq/artifacts/342-imgImage.svg
- public/homiq/fidelity/mid-entry.svg
- public/homiq/fidelity/mid-structure.svg

Other updates: scripts/homiq/build-fidelity.py, tests/homiq-case-study.test.mjs and tests/fixtures/homiq-layout.json.
