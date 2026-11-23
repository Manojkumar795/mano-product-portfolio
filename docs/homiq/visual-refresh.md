# Homiq competitor and low-fidelity visual refresh

22 October 2026. Scoped to Competitor Analysis and Low-Fidelity. Main section typography, ordering, other graphics and all 29 supplied product screens remain unchanged.

## Competitor comparison

Three equal visual columns, linked brand names, and one concise takeaway per product. No added eyebrow, metadata subtitle, rating, fabricated testing result, or duplicate caption. Native HTML keeps the text selectable and accessible; white-panel type follows the established 20/13px scale.

Official sources and media:

- Apple Home: https://support.apple.com/en-us/102313 (scenes and automation behavior). Overview image from https://support.apple.com/en-euro/guide/iphone/iph22d98bbca/ios ; media https://ipcdn-web.apple.com/assets/v2/web/33a19bba-82c2-418e-835b-6860b6b1ee9b . Saved as public/homiq/competitors/apple-home.png.
- Google Home: https://blog.google/products-and-platforms/devices/google-nest/google-home-app-gemini-redesign/ . Media https://storage.googleapis.com/gweb-uniblog-publish-prod/images/GHA_Hero-Image_Hero.width-1200.format-webp.webp . Saved as public/homiq/competitors/google-home.webp.
- SmartThings: https://www.samsung.com/us/support/answer/ANS10002640/ and https://support.smartthings.com/hc/en-us/articles/360051931952-Routines-in-SmartThings . Media https://image-stgus.samsung.com/SamsungUS/support/solutions/mobile/apps/US_ANS_MOB_APP_Use-automations-in-SmartThings.jpg . Saved as public/homiq/competitors/smartthings.jpg.

The images remain official product imagery, not generated competitor UI. Takeaways compare documented interaction patterns, without scores or superiority claims.

## Low-fidelity asset

Mode: built-in image_gen, ui-mockup / rough pen sketch. The supplied rough drawing reference guided the visual treatment; all screen content was adapted to HOMIQ. This is a newly created presentation asset, not an original research notebook.

Selected asset: /Users/manojkumar/Documents/Codex/portfolio/Mano-Portfolio/public/homiq/fidelity/rough-exploration.png

One board with nine uneven screen outlines, crossed placeholders, black pen marks and blue handwritten annotations. No phone hardware or finished interface cards. The image opens at full resolution on activation, including for mobile readers. Existing four individual sketch files remain in the asset archive but are no longer rendered.

### Initial prompt

Use case: ui-mockup, rough UX ideation drawing. Transform the attached reference into a HOMIQ smart-home low-fidelity exploration board. The reference is for drawing style and overall composition only. Replace ALL fitness, shopping, club and Visavis content with the HOMIQ concepts below.
Match the reference's very rough black ballpoint-pen screen rectangles and small blue handwritten annotations on a completely white sheet. Wide landscape board, about 1.5:1. Nine tall rectangular screen sketches loosely arranged in two rows, hand-drawn uneven borders and proportions, crossed X image placeholders, scribbly placeholder text strokes, simple squares and circles for controls, blue arrows and short notes outside screen edges. Some rough overdrawn/corrected lines. A quick designer's working sketch, not a polished illustration.
Top row five screens: Home (device categories, Morning and Goodnight scene tiles, frequent devices), Rooms (three crossed image cards), Living room (light, TV, AC list), Lamp (ON, 40%, rough brightness arc), Daily AC (24 C, power and swing).
Bottom row four screens: Add light (large rough QR square, Scan / NFC, arrow to found), Name light (room choice then short name field and Add), Create room (name, crossed photo box, devices), Create scene (Goodnight, checkbox device membership, separate ON/OFF choices, Create scene).
Use ONLY these short handwritten screen titles and labels where needed. Blue annotations include "room first", "show state", "pick devices", "set ON / OFF", "keep name on retry". No paragraph captions, no extra heading on the board, no decorative numbering. Preserve the reference's loose annotation-rich pen drawing character.
STRICT: no smartphone hardware frames, no rounded polished phone mockups, no status bars, no camera notches, no realistic devices, no paper grain, no shadows, no photographs, no gray filled cards, no typography pretending to be a finished app, no clean vector wireframe aesthetic. Rectangular screen edges drawn directly on white paper. The result must look much rougher than a UI mockup. Keep all sketches completely visible with modest white margins.

### Selected refinement prompt

Edit this HOMIQ sketch board to make it substantially rougher and closer to an actual quick UX working drawing. Preserve all nine HOMIQ screen concepts, black pen and blue note colors, white background and overall two-row composition. Make the screen rectangles visibly uneven and loosely ruled, with some retraced overlapping strokes. Replace the three detailed room perspective illustrations with simple boxes crossed by a large X. Make small body text mostly quick hand-scribbled lines, reserving legible handwritten words for the main short headings and essential UI labels. Add a few blue handwritten arrows and corrections in the margins, like an informal designer notebook reference. Vary stroke pressure and letter size; avoid the consistent neat handwriting-font look. Do not add paper texture, hardware device mockups, phone bezels, status bars, rounded finished interface cards, shading, photos, polished icons, extra titles or decorative captions. The overall impression should be a five-minute exploratory pen sketch rather than a polished hand-drawn UI illustration.

## Verification

- Build: npm run build:local.
- Regression checks: 19 tests across Homiq case study, research, rendered HTML and playground suites.
- Artifact validation: bash scripts/validate-artifact.sh.
- Desktop browser review at 1440 × 1000; mobile layout check at 390 × 844. The existing case-study artboard scaling remains in place; the rough board also links to its full-size image.
- Only the intentional Section328 JSX signature and scoped stylesheet hash were refreshed in the layout fixture.
- React review: server-rendered stateless components, stable keys, useful alt text, lazy images, source links and no new client bundle dependencies.
