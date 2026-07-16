# Character Reference-Sheet Prompt Specifications

All specifications inherit the identity/style/continuity/negative blocks in ../../07-image-prompts.md. They are NON-RUNNABLE while APPROVED_SOURCE_IDS or the evidence-linked identity profile is missing.

## CHR-SAGE-FACE-001 — face identity master

1. Asset/purpose: five-view neutral face identity control.
2. Inputs/controls: approved neutral front, left/right three-quarter, and left/right profile SRC-SAGE IDs; each controls only its evidenced view and stable identity.
3. Identity lock: use the global block; no averaging, idealization, or invented unseen feature.
4. Scene: neutral studio reference capture, not an editorial scene.
5. Placement/scale: five equal head-and-shoulder panels at matched head size and eye line.
6. Performance: neutral mouth/eyes, relaxed jaw, direct or view-correct gaze, resting approved hair.
7. Wardrobe: plain unbranded neutral neckline; no obstructing jewelry.
8. Camera: eye-height, fixed distance, level, approximately 85–105 mm full-frame equivalent, f/8-like depth, crisp shutter, identical crop.
9. Output: 5:2 sheet master or five same-size files; minimum useful face detail; no website crop.
10. Geometry: neutral mid-gray background and fixed eye/nose/chin guide positions.
11. Light: soft neutral key, low-ratio fill, no colored spill, approximately daylight neutral, consistent exposure.
12. Palette/grade: neutral colorimetric reference, no cinematic grade.
13. Layers: clean background, subject only, no props.
14. Continuity: canonical input for all later character assets.
15. Preserve: every approved stable identity feature, hairline, apparent age, skin tone, left/right orientation.
16. Prevent: face reshaping, beauty retouch, makeup invention, asymmetry corruption, duplicate accessories, labels.
17. Output requirements: separate lossless views plus contact sheet; file/version metadata; no baked captions in image.
18. Downstream: likeness review and future identity-anchor stills.
19. Review: matched-crop comparison against at least three originals; 100% inspection of eyes, ears, hairline, lips, jaw.
20. Provenance/rights/state: private; source-linked; RIGHTS_UNKNOWN until G2; output begins GENERATED, never automatically approved.

## CHR-SAGE-BODY-001 — proportion master

1. Asset/purpose: six-view full-body proportion control.
2. Inputs/controls: approved full-body front/side/rear and three-quarter SRC-SAGE IDs; face sheet controls identity.
3. Identity lock: global block plus CHR-SAGE-FACE-001 exact approved version.
4. Scene: neutral studio/floor grid.
5. Placement/scale: full body, consistent head and foot coordinates, no perspective size changes.
6. Performance: neutral stance, relaxed hands visible, view-correct gaze, resting hair.
7. Wardrobe: fitted opaque unbranded neutral separates; stable shoe/foot reference.
8. Camera: level, fixed camera around mid-torso height, long natural lens around 70–100 mm equivalent, f/8-like depth, no wide-angle distortion.
9. Output: six equal full-height views; high-resolution inspection master; no public crop.
10. Geometry: fixed floor plane, height grid, background, camera distance, and turn increments.
11. Light: broad neutral front/side modeling with consistent contact shadow.
12. Palette/grade: neutral; no body-sculpting contrast.
13. Layers: clean studio, subject, floor/contact shadow only.
14. Continuity: must match face and source-established height/proportions; feeds gait/wardrobe/keyframes.
15. Preserve: head/body ratio, shoulder/torso/hip/limb proportions, stance traits, skin tone.
16. Prevent: lengthened legs, narrowed waist, changed musculature, floating feet, extra limbs, source logos.
17. Output requirements: individual views plus grid; exact camera/settings record.
18. Downstream: subject-scale calculation, wardrobe fit, gait, and full-body keyframes.
19. Review: overlay silhouette against usable originals; inspect hands/feet/joints/contact.
20. Provenance/rights/state: private; source-linked; BLOCKED until approved full-body evidence.

## CHR-SAGE-EXPR-001 — expression master

1. Asset/purpose: six source-bounded expressions.
2. Inputs/controls: approved facial originals controlling neutral, focused, smiles, and glance-back; face master locks identity.
3. Identity lock: face geometry/apparent age cannot move with expression.
4. Scene: neutral consistent portrait reference.
5. Placement/scale: equal head-and-shoulder scale and eye line.
6. Performance: neutral, focused, confident runway, soft smile, warm smile, and glance-back; natural hands outside crop.
7. Wardrobe: same plain neckline and hair state unless the expression requires approved glance movement.
8. Camera: same lens/height/distance/depth as face master.
9. Output: six matched portraits; enough detail for teeth/eye review.
10. Geometry: identical neutral background and crop guides.
11. Light: identical neutral portrait rig.
12. Palette/grade: neutral.
13. Layers: subject/background only.
14. Continuity: each expression maps to named KF beats; no geometry drift between panels.
15. Preserve: stable identity and source-supported expression range.
16. Prevent: exaggerated grin, invented dimples/teeth, eye-color change, age shift, face reshaping.
17. Output requirements: individual views plus contact sheet.
18. Downstream: expression selection for KF-01–06.
19. Review: A/B against neutral face and source evidence; teeth/eyes/cheeks/jaw at 100%.
20. Provenance/rights/state: private and source-linked; every unseen expression remains PROPOSED until Sage approves.

## CHR-SAGE-HAIR-001 — hair and movement master

1. Asset/purpose: six controlled hair states for walk, transition, and resort breeze.
2. Inputs/controls: approved hair references; face/body masters control identity/proportion.
3. Identity lock: hair motion cannot change hairline, texture class, length, volume, color, or face.
4. Scene: neutral studio with explicit air/motion direction.
5. Placement/scale: matched three-quarter upper-body or full-body views as needed.
6. Performance: resting, backward movement, left-to-right, right-to-left, resort breeze, transition-safe silhouette.
7. Wardrobe: plain unbranded dark/light contrast garments selected to reveal hair edges.
8. Camera: fixed natural portrait lens, crisp base exposure with only physically directional strand blur.
9. Output: six matched views with adequate edge detail.
10. Geometry: fixed background and directional arrows recorded outside image metadata, never baked in.
11. Light: neutral edge-readable setup; no colored spill.
12. Palette/grade: neutral.
13. Layers: subject/hair separated cleanly from background.
14. Continuity: movement directions map to gait and TRANS-OCCLUSION-001.
15. Preserve: source-controlled hair and identity.
16. Prevent: new bangs/length/color, disconnected strands, veil-like mass, face occlusion except approved transition case.
17. Output requirements: individual states plus contact sheet; alpha/matte tests only if later authorized.
18. Downstream: KF-02–06 hair continuity and transition planning.
19. Review: hairline/ears/face, strand direction, silhouette, and temporal plausibility.
20. Provenance/rights/state: private/source-linked; BLOCKED pending hair references and consent.

## CHR-SAGE-GAIT-001 — runway gait master

1. Asset/purpose: six physically adjacent walking phases.
2. Inputs/controls: approved walking/full-body sources; face/body/hair masters lock person.
3. Identity lock: global block with exact approved character versions.
4. Scene: neutral runway-length studio lane and floor grid.
5. Placement/scale: same camera and subject scale per phase or a documented progression series.
6. Performance: initial stance, contact, passing, mid-swing, opposite contact, near-camera stride; hands naturally controlled; focused gaze.
7. Wardrobe: fitted neutral gait-review clothing; runway garment is evaluated separately.
8. Camera: locked level runway-axis view, natural compression, sufficient shutter for anatomy review.
9. Output: six high-resolution full-body phases.
10. Geometry: fixed floor/grid, centerline, foot marks, and camera height.
11. Light: even directional studio light with clear foot/contact shadows.
12. Palette/grade: neutral.
13. Layers: subject and floor only.
14. Continuity: phase order must be biomechanically plausible and map to KF-01–03.
15. Preserve: body proportion, stride character, balance, screen direction.
16. Prevent: foot sliding, crossed/fused legs, stride teleport, floating contact, arm duplication, runway-style caricature.
17. Output requirements: ordered individual files and contact sheet.
18. Downstream: keyframe gait selection and segment motion prompts.
19. Review: phase sequence loop, joints, hands/feet, center of mass, contact shadow.
20. Provenance/rights/state: private/source-linked; BLOCKED pending full-body/walking evidence.

## CHR-SAGE-CONT-001 — continuity control sheet

1. Asset/purpose: reviewed reference board of approved identity constraints and allowed variation.
2. Inputs/controls: exact approved versions of face/body/expression/hair/gait sheets and their source IDs.
3. Identity lock: evidence-linked text plus matched approved crops; no generative completion.
4. Scene: documentation layout, not a story image.
5. Placement/scale: consistent diagnostic crops and silhouettes.
6. Performance: selected canonical neutral/runway/warm states only.
7. Wardrobe: separate approved runway/resort swatches; never used to redefine body.
8. Camera: cite source/sheet camera for every crop.
9. Output: private review board and machine-readable constraints; no public use.
10. Geometry: diagnostic grid only.
11. Light: label physical light differences; do not normalize away skin/feature evidence.
12. Palette/grade: neutral diagnostic presentation.
13. Layers: evidence crops, silhouettes, material swatches; text remains outside generated pixels.
14. Continuity: canonical dependency for every keyframe/video attempt.
15. Preserve: all approved stable fields.
16. Prevent: contradictions, unlabeled inferred views, source mix-ups, hidden superseded versions.
17. Output requirements: versioned board plus linked manifest record.
18. Downstream: prompt compiler, review, defect diagnosis.
19. Review: Sage approves exact stable/variable/prohibited lists and selected versions.
20. Provenance/rights/state: private; compiled only from APPROVED sources/outputs; no generative provider required.
