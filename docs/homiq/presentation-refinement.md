# HOMIQ presentation refinement — 22 October 2026

Approved scope: hero and Program+ style sticky toolbar, a screen anatomy design-system board, proposed recovery UI states, and small audit-chart refinements.

- Hero and toolbar now render outside the scaled case-study canvas. The header uses a shared left edge and the approved copy. The existing five-frame original-screen walkthrough retains autoplay, pause, manual selection and reduced-motion behavior. Controls provide at least 44 CSS-pixel targets at the checked mobile and desktop sizes.
- The original Home PNG is unchanged. Seven numbered, horizontal callouts identify the header, add action, categories, scenes, device rows, state labels and bottom navigation. Mobile stacks the annotated screen and component list. Foundations describe observed visual patterns without inventing implementation tokens.
- Three explicitly proposed recovery states replace the flowchart and repeated bullets. Each retains Bedroom / Bedroom light; the failed state explains the issue and offers retry. These are static design illustrations, not a paired-device simulation.
- Six bar charts retain their data, ordering and color mappings. Labels and values share each row center; light gridlines, consistent padding and integer score ticks improve alignment. Audit attribution appears once in section copy. Regenerate just these assets with `python3 scripts/homiq/refine-audit-charts.py` after any full artifact rebuild.
- Recovery and Design System use content-driven section heights; the remaining 27-section structure, original PNGs, fidelity galleries and approved diagrams are preserved.

Validation: production build, existing 19 regression checks, artifact validation, desktop / 390px mobile visual review, toolbar anchors, manual walkthrough selection and playback. The source-build publication path is retained because previous archive transfer attempts repeatedly timed out.
