# HOMIQ audit and inline comparison update

Audit date: 21 October 2026. Designer: Manoj Kumar N.

## Evidence and counting rules

Manual inventory of 29 supplied 390 × 844 PNGs. Counts describe visible interface evidence, not user behavior.

- **screen:** One unique supplied PNG; a journey includes its final confirmation where supplied.
- **field:** Editable named data field; verification code is one field. Locked email is excluded. Field requiredness is not established by screenshots; counts are task-form inputs, not validated required attributes.
- **action:** One visually distinct control, including each back control, close, navigation destination, selectable option, switch or continuous input. A whole row and its embedded arrow/checkbox count once. Editable fields are counted separately. Scan/NFC explanatory blocks and scan viewport are not counted as independent buttons. Hidden actions and behavior are not inferred.
- **decision_stage:** A non-result stage asking for a method, confirmation, selection or data entry; multiple options within one stage do not add stages.
- **depth:** Structural levels from a top-level tab: root 0, room appliance list 1, appliance detail 2. Home-category to appliance detail is a candidate depth-1 route, not a verified tap path.
- **feedback:** Dedicated named confirmation frames; no error, offline or permission-denial frames appear in the supplied set.

29 screens; 15 editable fields; 176 visible controls under the stated rules. Required-field validation cannot be determined from a raster frame. No historical participants, quotes or achieved task outcomes are claimed.

## Journeys

| Task | Supplied frames | Decision stages | Editable fields |
|---|---:|---:|---:|
| Device setup | 5 | 4 | 1 |
| Room creation | 4 | 3 | 1 |
| Scene creation | 5 | 4 | 1 |
| Account recovery | 3 | 3 | 4 |

## Screen-level inventory

| Frame | Family | Fields | Visible controls |
|---|---|---:|---:|
| welcome | entry | 0 | 1 |
| sign-in | entry | 2 | 6 |
| create-account | entry | 3 | 5 |
| recover-password | entry | 1 | 3 |
| verify-code | entry | 1 | 3 |
| change-password | entry | 2 | 2 |
| my-home | rooms | 0 | 14 |
| my-rooms | rooms | 0 | 7 |
| room-name | rooms | 1 | 4 |
| room-choose-photo | rooms | 0 | 10 |
| room-select-devices | rooms | 0 | 10 |
| room-added | rooms | 0 | 1 |
| room-appliances | rooms | 0 | 9 |
| device-scan-or-nfc | device | 0 | 3 |
| device-light-found | device | 0 | 3 |
| device-select-location | device | 0 | 12 |
| device-name | device | 1 | 3 |
| device-added | device | 0 | 2 |
| air-conditioner | controls | 0 | 8 |
| lamp | controls | 0 | 6 |
| tv-remote | controls | 0 | 15 |
| scene-choose | scenes | 0 | 5 |
| scene-name | scenes | 1 | 3 |
| scene-select-devices | scenes | 0 | 14 |
| scene-set-device-states | scenes | 0 | 8 |
| scene-added | scenes | 0 | 1 |
| profile | account | 0 | 8 |
| profile-details | account | 3 | 5 |
| push-notifications | account | 0 | 5 |

Exact control and field labels, flow membership, component membership and rubric cells are in [audit-data.json](audit-data.json). The artifact generator reads this file; aggregate counts are not survey data. QR/NFC instructions are two methods, not counted as two independently evidenced buttons.

## Visible control evidence rubric

0 = absent from supplied frame; 1 = partial; 2 = explicit. Four criteria, maximum 8. This is an evidence coverage score, not a usability or compliance score.

- **identity:** 2: room and appliance named; 1: only one named; 0: neither.
- **power:** 2: power text plus switch; 1: only text or switch; 0: neither.
- **range:** 2: current primary numeric value, unit and explicit bounds; 1: value and unit without bounds; 0: no numeric feedback.
- **alternative:** 2: visible non-drag alternative for primary continuous value; 1: hint of alternative without visible control; 0: none visible.

| Control | Identity | Power | Range | Non-drag alternative | Total / 8 |
|---|---:|---:|---:|---:|---:|
| air-conditioner | 2 | 2 | 2 | 0 | 6 |
| lamp | 2 | 2 | 1 | 0 | 5 |
| tv-remote | 2 | 2 | 1 | 0 | 5 |

All three controls visibly name the room/appliance and show power text plus a switch. AC also shows explicit 18°–30° bounds. Lamp brightness and TV volume show a percentage without explicit endpoints. No non-drag alternative for their primary continuous value is visible; this is absence of evidence in the supplied frames, not a runtime accessibility verdict.

## Proposed measurement targets

| Metric | Initial target | Operational definition |
|---|---|---|
| Device completion | ≥90% | Independently add the correct light to the correct room; successful unassisted tasks / all device-task attempts. |
| Device setup time | ≤90s median | Discovery screen displayed to named confirmation; report successful-attempt median and failed attempts separately. |
| Room completion | ≥95% | Correct room name, selected photo and intended devices saved / all room-task attempts. |
| Scene completion | ≥85% | Correct scene membership AND all requested ON/OFF states saved / all scene-task attempts. |
| Scene time | ≤120s median | Choose-scene screen displayed to scene-added confirmation; successful-attempt median. |
| Device control access | 1–2 taps | From Home to the requested supported appliance control, excluding the adjustment itself. Verify category routing in an interactive prototype. |
| Post-task confidence | ≥4.2/5 mean | Immediately rate confidence that the intended change is correct, 1 not at all to 5 completely; report sample size and distribution. |
| Setup abandonment | ≤10% | Device setups explicitly cancelled or with no terminal success for 10 minutes / setup starts. Deduplicate resumed attempts by session ID; separate crashes and observed study failures. |

Completion rates use all initiated attempts as denominator; report assistance, errors and failures separately. Timing medians use successful attempts and must be read with completion rates. Product events should carry task/session IDs, stage, timestamp, result and exit reason, with no unnecessary personal data. No target is an achieved result or a published industry benchmark.

## Published sources

- Brush et al., **Home Automation in the Wild: Challenges and Opportunities**, CHI, May 2011. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/home-automation-in-the-wild-challenges-and-opportunities/). Foundational evidence on manageability and household system complexity; not a current adoption estimate.
- Eric Zeng & Franziska Roesner, **Understanding and Improving Security and Privacy in Multi-User Smart Homes: A Design Exploration and In-Home User Study**, USENIX Security, August 2019. [Primary publication](https://www.usenix.org/conference/usenixsecurity19/presentation/zeng). Shared-household intelligibility informs roles, not HOMIQ recruitment.
- UChicago CS, **UChicago CS Collaboration Hopes to Improve Communication Between Humans and Smart Devices**, 4 February 2019. [University research report](https://cs.uchicago.edu/news/uchicago-cs-collaboration-hopes-to-improve-communication-between-humans-and/). Rule interactions motivate explicit scene intent; no HOMIQ trigger editor is claimed.
- W3C, **WCAG 2.2**, Recommendation, 12 December 2024. [Dragging movements](https://www.w3.org/TR/WCAG22/#dragging-movements). Used as an evaluation principle; no whole-app conformance claim.
- Apple Support, **Create scenes and automations with the Home app**, 22 September 2025. [Official documentation](https://support.apple.com/en-nz/102313).
- Google Home Help, **Organise your homes and devices**, undated, reviewed 21 October 2026. [Official documentation](https://support.google.com/googlehome/answer/15559809?hl=en-GB).
- SmartThings Support, **Routines in SmartThings**, undated, reviewed 21 October 2026. [Official documentation](https://support.smartthings.com/hc/en-us/articles/360051931952-Routines-in-SmartThings).

## Scope and layout

The latest explicit request replaces the research gateway with four stacked comparisons in the existing Design Decisions section. Each retains the 544×441 left media rectangle and 360px right reasoning column. Row starts: 341, 882, 1423 and 1964px. Section height expands from 782 to 2405px; trailing content moves down by 1623px, and the 25,003px canvas becomes 26,626px. All 27 section positions/order/typography outside this necessary expansion remain governed by the baseline geometry test. The existing responsive scale and crop are unchanged. Three archetype bars retain their outer geometry but their fills now encode actual 5/4/5 frame counts on a common five-frame scale. Chart data and the journey curve now encode audit measurements.

The former /homiq/research URL redirects to /homiq. No main-case-study element links to a separate research screen. All 29 current and four selected earlier PNGs remain byte-identical and uncropped. The four earlier frames contain no visible CoShell wordmark. Homiq is the only project changed.
