# Image Prompt System

Status: PROPOSED. The library remains non-runnable except for the explicitly authorized private CHR-SAGE-FACE-001 diagnostic batch defined in prompts/character/reference-sheets.md. That narrow exception uses five selected private source IDs, permits no more than three OpenAI Image Creator candidates, and does not approve commercial use or any later character, environment, keyframe, video, Higgsfield, website, or publication work.

## Assembly order

Each asset prompt is assembled in this order:

1. Asset-specific purpose and input mapping.
2. Global identity lock.
3. Global visual-style prefix.
4. Scene, subject, wardrobe, camera, geometry, light, palette, and layering.
5. Adjacent continuity block.
6. Must-preserve and negative constraints.
7. Output, downstream use, review, provenance, rights, and approval status.

No production prompt asks for typography, logos, watermarks, interface elements, or audio.

## Global identity prefix

Use for production-bound work only after G1–G3 and only with approved inputs:

> Depict the single real person controlled by [APPROVED_SOURCE_IDS] and the approved identity specification CHR-SAGE-CONT-001. Preserve the evidence-linked face geometry, skin tone under the specified physical light, apparent age, hairline, hair texture/color/length, body proportions, stable distinguishing features, and left/right orientation. References control identity rather than wardrobe, location, brand marks, background, lens distortion, retouching, or source lighting. Do not average with another identity, idealize facial geometry, change apparent age, reshape the body, copy source logos, or infer traits not documented in CHR-SAGE-CONT-001.

Required variables:

- APPROVED_SOURCE_IDS
- EVIDENCE_LINKED_IDENTITY_FIELDS
- ALLOWED_STYLING_VARIATION
- PROHIBITED_IDENTITY_DRIFT

If any variable is unfilled, the prompt is not runnable.

Diagnostic exception: CHR-SAGE-FACE-001 v1 resolves its source mapping and identity constraints directly inside the twenty-field asset specification. It is runnable only for the owner-authorized private OpenAI batch, while every source remains RIGHTS_UNKNOWN for commercial/public use and both unseen profiles remain PROPOSED inference.

## Global visual-style prefix

> Premium contemporary fashion and hospitality editorial; spatially plausible architecture; disciplined composition; restrained material palette; natural human anatomy; physically coherent light, shadow, reflection, motion, and depth; polished but not plastic; cinematic tonal control; no imitation of a named photographer, campaign, venue, hotel, or designer.

## Continuity block

> Treat the cited approved adjacent asset(s) as fixed continuity boundaries. Preserve identity, body proportion, screen direction, selected gait phase relationship, camera height/axis/lens family, subject scale progression, wardrobe version, hair behavior, environment anchor positions, light-source positions, shadow/reflection logic, and transition-edge direction. Change only the fields explicitly identified for this beat. The output must be usable as the exact start or end anchor named in the downstream segment.

## Shared negative constraints

- No second person, crowd mutation, duplicate body, face swap, mixed identity, or apparent-age change.
- No extra/missing fingers, fused limbs, broken feet, floating heel, malformed teeth, asymmetric eye corruption, or fabric-through-body artifacts.
- No logos, brand marks, typography, captions, watermarks, UI, QR codes, or audio cues.
- No impossible architecture, changing anchor geometry, horizon jump, lens warp, dutch roll, random furniture, or incoherent reflection.
- No source-image background, branded garment, jewelry, retouching artifact, or source lighting unless explicitly approved.
- No excessive skin smoothing, orange/gray skin, color-contaminated teeth/eyes, or identity-changing beauty edit.
- No contradictory lens, camera movement, time-of-day, or light instructions.

## Twenty-field prompt contract

Every individual specification must contain:

1. Asset ID and purpose.
2. Input reference IDs and the control supplied by each.
3. Identity-lock instructions.
4. Scene and narrative moment.
5. Subject placement and scale.
6. Pose, gait, hands, gaze, expression, and hair.
7. Wardrobe and material behavior.
8. Camera position, height, distance, angle, movement intent, full-frame-equivalent focal length, aperture/depth, shutter/motion-blur intent, and framing.
9. Aspect ratio, target resolution, crop, and website safe zones.
10. Environment geometry and fixed anchors.
11. Lighting sources, direction, intensity relationships, color temperature, shadows, and exposure.
12. Palette and grade.
13. Foreground, middle ground, background, atmosphere, and layering.
14. Relationship to adjacent assets/frames.
15. Must-preserve constraints.
16. Negative constraints and artifact prevention.
17. Output requirements.
18. Downstream use.
19. Review checklist.
20. Provenance, rights, privacy, and approval state.

Official public schemas do not document a universal character limit or negative-prompt field for current video models. Prompt length is therefore model-preflighted, not assumed. Detailed specifications may be compressed into a provider-compatible prompt only after selecting the exact model and checking its authenticated schema.

## Library index

- prompts/character/reference-sheets.md — face, body, expression, hair, gait, and continuity sheets.
- prompts/wardrobe/wardrobe-sheets.md — runway and resort wardrobe turnarounds.
- prompts/runway/environment-system.md — runway plates, maps, materials, lights, and transition controls.
- prompts/resort/environment-system.md — resort plates, maps, materials, and lights.
- prompts/keyframes/desktop.md — KF-01 through KF-06 at 16:9.
- prompts/keyframes/mobile.md — KF-01 through KF-06 at 9:16.
- prompts/video/architecture-b.md — four start/end motion-segment specifications.

Each file uses the twenty-field contract by reference and fills every asset-specific field. Shared blocks remain centralized to prevent prompt drift.

## Prompt change control

- Prompts are versioned, hashed, and linked to outputs.
- Change one diagnosed variable group at a time when practical.
- Record the defect hypothesis and prompt/settings delta before rerunning.
- Never replace a rejected prompt/output record; supersede it.
- An attractive result cannot bypass source, rights, identity, or continuity review.
