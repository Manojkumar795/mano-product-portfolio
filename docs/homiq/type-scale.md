# Homiq type and image scale

The imported composition has two distinct scales: editorial section headings/body at 25/18px, and white-panel artwork at approximately 20–21/13px with 10px labels. The new panels now follow the artwork scale rather than repeating the larger editorial scale inside each card. White-panel text uses Arial, matching the existing SVG artwork; dark editorial text keeps Inter.

Both green-circle groups share the same resolved SF/system sans font, 400 weight, 35/42px numbers, 18/21.6px body, and the reference letter spacing of -0.6698px and -0.9795px. Imported SF text labels throughout Homiq now resolve to a sans face rather than an unavailable font name and serif fallback.

The standalone scene screen is 126px wide, matching the original sequence artwork. Structural wireframes are 140×300px on the desktop artboard. Narrow displays retain readable panel copy through reflow and show the structural screens at a consistent small presentation size.

The IA distinguishes a destination/screen hierarchy from the sequential room-creation task. Rounded hierarchy rails connect the three primary destinations and child screens; a dashed sequence identifies Name room → Choose photo → Select devices → Room added. A legend explains the relationship types. The source and prototype-verification qualification remains visible.

QA: all 27 sections were checked at 1920, 1440, 1280, 1024, 768, 390 and 375px. There were no section overlaps, page horizontal overflow, panel text overflow or clipped wireframe content. Computed font family, size, weight, tracking and line height match exactly between the original and new circle groups at every viewport. Production build, artifact validation and all 19 existing tests passed. Original PNG assets and other projects are unchanged.
