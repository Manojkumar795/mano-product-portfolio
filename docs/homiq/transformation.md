> Historical transformation record. Current content and evidence rules are documented in [audit-methodology.md](audit-methodology.md) and [verification.md](verification.md); the former illustrative dataset has been replaced.

# HOMIQ content transformation

Scope: Homiq only. All 29 source images visually audited before authoring; source PNGs retained byte-for-byte. Existing 27-section order, containers, typography, CSS, scaling, navigation and footer retained.

## Evidence policy

Screenshots establish interface content, not a functioning backend, hardware compatibility, shipped status or user outcomes. Research, personas, quotes and charts are explicitly simulated/illustrative. Wireframes are retrospective explorations. Metrics are future measures; no achieved results or historical interviews are claimed. Ruben Geidt is sample account data in an unchanged source screen; designer byline is Manoj Kumar N. Business model, client, duration, team and launch status are unspecified.

## Section mapping

| Existing section | Previous content | Homiq replacement | Media treatment |
|---|---|---|---|
| Overview | Retail challenge, dates and tools | Smart-home scope, designer, platform, evidence boundary | Hero / welcome |
| Our Vision | Social retail vision | Room context, guided setup, intended household value | Narrative |
| The Process | Historical research stages | Audit → framework → exploration → UI → validation | Existing five columns |
| Initial Problem Discovery | Retail/social discovery | Setup uncertainty and heterogeneous controls, audit hypotheses | Narrative |
| Research illustrations | Retail examples | Fragmented control vs room-context mental models | Original paired diagrams |
| Problem statement | Sales problem | Find device, know state, act with confidence | Narrative |
| Desk Research | Unsupported market statistics | Questions, methods and three task priorities | Unchanged green circles; descriptive labels |
| Competitor Analysis | Retail comparisons | Official Apple/Google/SmartThings patterns; HOMIQ opportunities | Original comparison matrix |
| User Surveys | Retail research dashboard | Simulated research framework and illustrative datasets | Same white dashboard, same chart boxes |
| User Pain Points | Purported survey findings | Four audit hypotheses and design implications | Unchanged four green circles |
| User Persona | Reference persona | Two hypothetical household profiles; primary profile in original composition | Original monogram portrait; secondary profile in dashboard |
| User Journey | Social meeting narrative | Hypothetical light-setup journey; actual screens identify steps | Original progress curve |
| Developing a Solution | Retail goals | IA, four task flows and priority tradeoffs | Original IA inside same media box |
| Moodboard | Other products/inspiration | Affinity themes, visual grammar and retrospective choice matrix | Original artifacts + unchanged UI in same montage boxes |
| Low-Fidelity | Old wireframes | Retrospective wireflows for four real tasks | Five same-sized wireframe slots |
| Mid-Fidelity | Old wireframes | Retrospective hierarchy explorations plus authentic account/room flows | Two existing gallery boxes |
| High-Fidelity | Retail sales deck | Actual home/rooms and appliance controls | Original supplied PNGs |
| Design Decisions | Untested nav changes | Room context + progressive disclosure; hypothesis/benefit/test | Paired actual UI and concise narrative |
| Design Decision: Color | Green symbolism | HOMIQ app palette, separate from editorial site colors | Narrative |
| Color research | Unsupported theory claims | Observed screenshot palette, contrast questions | Narrative |
| Color palette | Retail palette | Documented HOMIQ app swatches | Original palette board |
| Empty State | Retail placeholders | Proposed recoverable failures, not supplied implemented states | Original conceptual state diagram |
| Design System | Fabricated team/pilot history | Screenshot-derived typography, components, controls, spacing estimates | Three original boards |
| UI for Launch | Retail launch gallery | Actual device and scene sequences; no launch claim | Existing gallery dimensions |
| Post Designs Outcome | Fabricated contracts/launch | Future validation tasks/metrics and intended outcomes | Authentic device success screen |
| My Key Takeaways | Retail lessons | Accessibility checks, tradeoffs and future priorities | Existing two columns |
| Reflection by Manoj | Retail conclusion | Evidence-aware reflection by Manoj Kumar N | Existing closing text composition |

## Source-supported observations

- [Apple Home scenes and automations](https://support.apple.com/en-nz/102313): scenes combine accessory states; automation has distinct trigger configuration.
- [Apple Home setup](https://support.apple.com/en-mide/guide/iphone/iph125110541/27/ios/27): add accessories, assign rooms and names.
- [Google Home organization](https://support.google.com/googlehome/answer/15559809?hl=en-GB): homes, room placement and device settings.
- [SmartThings devices](https://support.smartthings.com/hc/en-us/articles/360052390111-Devices-in-SmartThings): QR/nearby discovery and manufacturer-dependent controls.
- [SmartThings routines](https://support.smartthings.com/hc/en-us/articles/360051931952-Routines-in-SmartThings): separate IF conditions and THEN actions.

These are documentation observations reviewed 20 October 2026, not hands-on competitor usability or accessibility tests. HOMIQ recommendations are interpretations.

## Audit conclusions

Strong visible patterns: stable Home/Rooms/Profile navigation, room/device state counts, ON/OFF text, explicit 24°C and 40% values, step indicators, contextual confirmations. Primary opportunities: scanner permission/failure recovery, scene discovery, room image/name distinction, accessible alternatives to dragging, target/contrast validation and error states. Scene membership is separate from desired ON/OFF state. No scheduled/conditional automation editor, execution logs, energy dashboard, security control or offline state is supplied.

## Confirmed screen sequences

- Device: scan/NFC → light found → select location → name → added. Actual scanning and connectivity unverified.
- Room: name → choose photo → select devices → added. Living room appliance view is a separate example.
- Scene: choose → name → select devices → set states → added. These are manual scene definitions; no trigger editor.
- Daily control: home/rooms → contextual appliance view → dedicated control. Connections between static screens are inferred, not interaction recordings.
- Recovery: recover password → verify code → change password. Error handling and success unverified.


## Necessary implementation exception

Browser testing exposed the existing ResizeObserver delivery loop in `CaseCanvas.tsx`, producing a development error overlay on resize/scroll. The observer now defers writes to the next animation frame and ignores unchanged widths. Initial synchronous sizing, all scale/crop equations, the 1000px breakpoint and every visual dimension remain unchanged. The observer and queued frame are cleaned up on unmount. No navigation, reveal, hover or other interaction was rebuilt.
