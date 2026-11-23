# Discovery refinement — 22 October 2026

Implements the approved proposal: three coral (#FF6259) text highlights in Initial Problem Discovery, one wide white visual containing three equal grayscale illustrations with restrained red callouts, and uniform 1–5 numbering in the five green insight circles.

The illustration questions are “Where is my device?”, “What is happening now?” and “What if setup stops?”. They frame design questions rather than claim observed user failures. The illustrations are native SVG components with no generated product screenshots or extra metadata headings.

Existing section ordering, typography scale, circle dimensions, original product PNGs, and the low/mid/high fidelity galleries remain intact. The discovery visual grows in normal document flow. Circle text returns to the shared position below the restored numbers.

Verification: desktop visual review at 1440 × 1000, narrow-layout boundary check at 390 × 844, production build, 19 existing regression tests, and artifact validation. Updated fixture entries cover only the intentional page composition, discovery emphasis, number restoration and stylesheet changes. React review confirms static components, inherited text styles, meaningful figure labels and decorative SVGs hidden from assistive technology.

Publishing uses the source-build fallback established after three archive-transfer timeouts in the preceding update. A matching local archive is retained for review.
