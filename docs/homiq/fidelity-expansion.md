# HOMIQ fidelity expansion — 22 October 2026

The supplied references guide the mid-fidelity presentation: flat rectangular screen canvases, grayscale content blocks, crossed image placeholders, outlined controls, restrained aqua navigation strips, and a dark library overview. All content is HOMIQ; none of the reference app's names, people, dates or interface copy is reused.

## Mid fidelity

- Six larger wireframes in two three-column boards: Home, Rooms, light control, room photo selection, scene membership and scene states.
- All 29 screen concepts appear in the grouped library overview. The six device choices and four subsequent state switches remain distinct.
- These are newly code-crafted presentation studies, not historical wireframe records. The generator is `scripts/homiq/build-mid-library.py`.
- Each SVG is 390 × 844, with no phone hardware, status bars, photographs or final dark/gold product styling. All individual studies and the overview open at full resolution.
- Assets are in `public/homiq/fidelity/mid/` and `public/homiq/fidelity/mid-library.svg`. Older mid-entry and mid-structure SVGs remain archived but are no longer rendered.

## High fidelity

19 unchanged supplied PNGs, organized into four complete groups:

- Everyday control: Home, Rooms, air conditioner, lamp and TV remote.
- Device onboarding: scan/NFC, discovery, location, name and confirmation.
- Room creation: name, photo, devices and confirmation.
- Scene creation: choose, name, membership, states and confirmation.

All images use the same displayed dimensions and complete 390 × 844 source aspect ratio. The four-screen room row is centered with equal margins. Each image opens at full resolution. Original product artwork is never regenerated, cropped or recolored.

## Layout and verification

The two sections use the existing 25/18px editorial type and 20/13px panel scale. They now grow in document flow, so the extra screens push later sections down without overlap. Section order and all unrelated sections remain unchanged; no new metadata eyebrow or decorative numbering was introduced.

Validation: all 29 SVG filenames match the original inventory, SVG XML parses, production build and artifact validation pass, and all 19 existing regression tests pass. Browser review at 1440 × 1000 verifies flat wireframes and all four product groups; DOM checks confirm 19 loaded product screens with identical dimensions. Mobile check at 390 × 844 confirms no document overflow and a positive gap between sections. The existing full-case-study scaling behavior is preserved, with full-size asset links for inspection.

React review: static server components, stable keys, meaningful image descriptions, reserved image dimensions, lazy loading, accessible full-size links, and no new client hooks or dependencies.

The intentional stylesheet, page wrapper and two section layout signatures are updated in the fixture. Other section signatures and all original product-screen byte hashes continue to be checked by the regression suite.

Publishing note: the deployment package omits nine superseded HOMIQ build assets (older sketch files and replaced mid/high boards). Source files and Git history remain intact. `scripts/homiq/prune-unused-build-assets.mjs` checks that application source no longer references each asset before pruning build output. This reduces upload size without changing the rendered page.
