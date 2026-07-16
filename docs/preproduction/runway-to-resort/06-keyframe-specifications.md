# Six-Keyframe Specifications

Status: PROPOSED. No keyframe file exists and no keyframe is APPROVED. KF identifiers describe narrative positions; desktop and mobile are separately generated variants.

## Shared locked dependencies

- Character: CHR-SAGE-CONT-001, plus approved face/body/expression/hair/gait sheets.
- Runway wardrobe: WARD-RUNWAY-001.
- Resort wardrobe: WARD-RESORT-001.
- Runway environment: ENV-RUNWAY-001 through 007.
- Resort environment: ENV-RESORT-001 through 007.
- Runway lights: LIGHT-RUNWAY-001 through 003.
- Resort lights: LIGHT-RESORT-001 through 003.
- Transition: TRANS-OCCLUSION-001.
- Exact source IDs: blocked until the intake register reaches APPROVED_SOURCE.

All dimensions below are master targets. Candidate cost tests may use lower resolution while preserving aspect ratio and composition.

## Composition rules

| Variant | Master target | Action safety | Copy/CTA safety |
|---|---|---|---|
| desktop | 3840×2160, 16:9 | 5% all sides | Owner selects left or right copy zone after empty-plate review; no text baked into image |
| mobile | 2160×3840, 9:16 | 8% sides, 6% top | Protect browser-chrome allowance and lower 16% for CTA/gesture area; no text baked into image |

Subject-height and exact foot/eye coordinates remain variables until the approved proportion sheet establishes credible scale.

## KF-01 — Runway Dormant — 0–15%

Narrative: Sage is centered at the far entrance in near darkness. The frame establishes the fixed runway, dormant practicals, camera axis, black wardrobe, and initial gait.

Dependencies: CHR-SAGE-FACE-001, CHR-SAGE-BODY-001, CHR-SAGE-GAIT-001, WARD-RUNWAY-001, ENV-RUNWAY-001/006/007, LIGHT-RUNWAY-001.

Desktop:

- Strong one-point perspective and full runway width.
- Sage full-body at entrance, small but unmistakably human; do not hallucinate facial specificity beyond usable pixels.
- Reserve the approved desktop copy side while keeping the vanishing point dominant.
- Camera locked on runway centerline; natural editorial compression.
- Practical fixtures dormant; subtle edge separation and readable foot/floor contact.

Mobile:

- Reposition camera in the same physical set to preserve runway depth vertically.
- Keep Sage large enough to establish a real person while retaining entrance, floor, and fixture rhythm.
- Copy-safe region is vertically staged, not inherited from desktop.
- Avoid narrow crop that removes the runway-width cue.

Adjacent compatibility:

- Same identity, set anchors, lens family, axis, wardrobe, and screen direction as KF-02.
- Select a gait phase that can advance physically into KF-02.

## KF-02 — Runway Ignition — 15–45%

Narrative: Sage is substantially closer as practicals activate in a controlled progression. Editorial confidence rises without identity change.

Dependencies: CHR-SAGE-FACE-001, CHR-SAGE-BODY-001, CHR-SAGE-EXPR-001, CHR-SAGE-HAIR-001, CHR-SAGE-GAIT-001, WARD-RUNWAY-001, ENV-RUNWAY-001/006/007, LIGHT-RUNWAY-002.

Desktop:

- Preserve camera position, horizon, vanishing point, set dimensions, and fixture anchors from KF-01.
- Sage occupies a documented larger percentage of frame at Mark B; both feet and gait phase remain plausible.
- Activated fixtures and matching floor reflections progress coherently.
- Face becomes reviewable but keeps a controlled runway expression.
- Maintain desktop copy safety without moving architecture.

Mobile:

- Use the mobile anchor map, same set and subject mark.
- Protect head/hair and both feet inside action safety.
- Practical progression must read vertically and not resemble random bokeh.
- Maintain lower CTA clearance even as subject scale grows.

Adjacent compatibility:

- KF-01 end → KF-02 start/end segment is a continuous approach.
- KF-02 must also be a valid start anchor for KF-02 → KF-03; exact file reuse is mandatory.

## KF-03 — Lens Occlusion — 45–58%

Narrative: Sage reaches the near-camera zone and approved black fabric, optionally supported by an approved hair edge, covers the lens enough to conceal an editorial cut.

Dependencies: all runway character sheets, WARD-RUNWAY-001, ENV-RUNWAY-001/004/006/007, LIGHT-RUNWAY-003, TRANS-OCCLUSION-001.

Desktop:

- Near-camera scale remains anatomically plausible before coverage.
- Visible face/body fragments stay source-accurate.
- Black fabric expands along the documented screen direction.
- Target 98–100% neutral black coverage with a useful hold region for the cut.
- Motion blur follows the fabric edge; it does not smear the entire frame.

Mobile:

- Re-author near-lens fabric path to cover the taller frame completely.
- Keep the transition edge inside side safety until full coverage.
- Do not leave uncovered top/bottom bands or expose distorted limbs at the edge.
- Match black level and warm-leak entry coordinates to mobile KF-04.

Adjacent compatibility:

- Exact KF-02 is the start anchor of the runway-close segment.
- KF-03 is the end anchor; the edit occurs only after full coverage.
- KF-03 and KF-04 are not interpolated together. Their black frames, edge direction, implied camera height, and screen direction must match editorially.

## KF-04 — Resort Light Leak — 58–64%

Narrative: Matched darkness opens with a warm directional light leak while resort geometry and the same moving person emerge.

Dependencies: approved character continuity, WARD-RESORT-001, ENV-RESORT-001/003/006/007, LIGHT-RESORT-001, TRANS-OCCLUSION-001.

Desktop:

- Begin from a near-black field visually matched to KF-03.
- Warm leak enters from the same edge and follows the same motion direction.
- Perceived camera height and subject movement continue through the hidden cut.
- Reveal path, building edge, and horizon progressively; avoid global dissolve.
- Visible identity areas are correct and resort wardrobe transformation is already complete behind coverage.

Mobile:

- Match the mobile KF-03 edge path, black level, and timing.
- Reveal enough vertical anchor geometry to establish the same resort without crowding subject.
- Preserve face/hair and lower CTA safety as the image opens.
- No desktop-derived crop.

Adjacent compatibility:

- Editorial match to KF-03; interpolation start for KF-04 → KF-05.
- Same exact KF-04 file begins the resort-reveal segment.

## KF-05 — Resort Reveal — 64–88%

Narrative: The full premium tropical resort is clear while Sage continues moving in the approved resort wardrobe and light.

Dependencies: all approved character sheets, WARD-RESORT-001, ENV-RESORT-001/002/005/006/007, LIGHT-RESORT-002.

Desktop:

- Full resort context: plausible path, architecture, water/horizon, and restrained foliage.
- Sage reaches Mark E without gait discontinuity or identity drift.
- Warm daylight and skin/wardrobe exposure remain physically coherent.
- Preserve an optional support-copy region; no decorative clutter.

Mobile:

- Use the mobile path and anchor map to create strong near-to-far vertical depth.
- Sage remains a primary subject, not a small background figure.
- Keep horizon/water and hospitality context visible.
- Protect lower CTA clearance and avoid face/foliage collisions.

Adjacent compatibility:

- KF-04 → KF-05 segment continues emergence into reveal.
- Exact KF-05 is reused as the start anchor for KF-05 → KF-06.

## KF-06 — Resort Resolve — 88–100%

Narrative: Camera and Sage settle into the final hero composition. A source-approved warm glance back is allowed. The image must work as poster and reduced-motion fallback.

Dependencies: all approved character sheets, WARD-RESORT-001, ENV-RESORT-001/002/006/007, LIGHT-RESORT-003.

Desktop:

- Sage settles at Mark F in an owner-approved final pose or glance-back.
- Resort, beach/water, and hospitality context remain immediately legible.
- Final heading/CTA safety is stable and visually quiet.
- Hands, face, teeth if visible, hair, garment, feet, and contact shadows pass 100% inspection.
- The frame remains complete with no motion or preceding context.

Mobile:

- Compose the final poster specifically for the tall viewport.
- Subject, horizon, path, and primary architectural anchor remain legible together.
- Reserve browser and gesture clearances and protect CTA contrast.
- Avoid a crop that cuts feet/hands or changes the approved expression.

Adjacent compatibility:

- KF-05 → KF-06 is a physically plausible settle, not a pose teleport.
- Exact approved desktop and mobile KF-06 files become the poster/reduced-motion candidates after separate web optimization.

## Required review for every variant

- Face/body identity and apparent age.
- Eye, hairline, hair, skin tone, and proportion continuity.
- Hands, feet, teeth, limbs, garment anatomy, and floor contact.
- Approved wardrobe, no trademarks, text, logos, or watermarks.
- Fixed environment anchors, camera geometry, horizon, vanishing point, lens family, and subject scale.
- Screen direction and adjacent gait phase.
- Physically coherent light progression, shadow, and reflection.
- Action/copy/CTA safe areas at the exact target aspect ratio.
- Adjacent start/end interpolation feasibility.
- Provenance, prompt/settings log, rights scope, and exact version.

No frame may be marked APPROVED solely because it looks attractive in isolation.
