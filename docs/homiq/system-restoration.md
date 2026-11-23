# HOMIQ design-system restoration — 23 October 2026

Approved scope: restore and enhance the full style guide, consolidate color rationale under Design System, simplify proposed recovery patterns, and correct anatomy pointers.

- The three formerly separate color sections now live inside the Design System foundations board. All five sampled colors and their exact hex values remain, alongside color reasoning, the 16.4:1 sample contrast, typography estimates, spacing rhythm and shape examples. Whole-app accessibility checks remain explicit.
- The restored Components & states board includes actions, text fields, membership and ON/OFF states, progress, bottom navigation, iconography, room cards, device rows and named confirmations. Most specimens are clipped presentations of the unchanged original PNGs; SVG clipping never edits the source artwork. Selection/switch primitives make their states readable at the same specimen scale.
- Anatomy follows the full guide. Callout targets are expressed in the original 390 × 844 screen coordinate space, then offset alongside the unscaled SVG image. Lines stop outside component edges or beside text, with small endpoint dots. My home, add control, category card, scene shortcut, device row, Air purifier OFF label and navigation pill each have a distinct target.
- Recovery uses three compact message components rather than tall app screens. Room and device name appear once in a retained-details row. These remain explicitly proposed, static patterns.
- There are now 24 outer case-study sections, because the three color sections were consolidated without discarding their content. Hero, toolbar, audit charts, original screenshots and fidelity galleries are unchanged.

Verification: production build; existing 19 regression checks; artifact validation; desktop and 390px mobile review. Public audience retained. Source-build publication remains the established fallback after repeated archive-upload timeouts in earlier turns.
