# Architecture B Motion Prompt Specifications

These prompts are the archived model-neutral source specifications for the executed Seedance 2.0 segment workflow. The exact model/schema/cost preflight passed, and all eight successful five-second 1080p silent segments passed structural and contact-sheet review. Current public video schemas have no universal negative-prompt or seed field, so negative constraints remain in the main prompt when supported.

Every attempt uses the exact approved start/end image hashes, no audio, the composition’s native aspect ratio, and the continuity block from ../../07-image-prompts.md.

## VID-RWY-{D|M}-001 — KF-01 to KF-02

- Purpose: controlled forward runway approach with progressive practical-light ignition.
- Start/end: exact approved KF-01 and KF-02 of the same composition.
- Motion: Sage advances along the fixed centerline through biomechanically adjacent gait; camera stays locked or uses only the approved minimal dolly; hair/fabric respond naturally.
- Geometry: no runway, fixture, horizon, or vanishing-point movement.
- Light: practicals activate in the documented physical sequence; shadows/reflections follow.
- Preserve: identity/proportion/outfit/screen direction/camera/lens; end frame must converge exactly toward KF-02.
- Prevent: face morph, foot slide, speed jump, crowd/object creation, camera orbit, fixture teleport, logo/text/audio.
- Test: 4–6 s at approved minimum useful resolution; record model/settings/cost/job/output.

## VID-RWY-{D|M}-002 — KF-02 to KF-03

- Purpose: continue approach into complete near-lens black-fabric coverage.
- Start/end: exact same KF-02 hash used above, then approved KF-03.
- Motion: physically continuous gait to Mark C; approved fabric edge expands in one direction; global frame does not smear.
- Geometry/light: runway stays fixed where visible; exposure transitions to the locked neutral-black target.
- Preserve: identity in every visible region, anatomy, garment construction, edge path, camera.
- Prevent: transparent occluder, uncovered border, limb/fabric fusion, face dissolve, hard prop, residual light at full cover, audio.
- Test: 3–5 s; ensure an editable full-black hold/cut interval.

## Hidden cut — KF-03 to KF-04

No generative interpolation. Place the editorial cut only inside matched full black. Match black level, edge direction, blur vector, screen direction, perceived camera height, and pace. The runway/resort wardrobe and world transformation happens entirely behind the coverage.

## VID-RST-{D|M}-001 — KF-04 to KF-05

- Purpose: directional warm leak opens into full resort while Sage continues moving.
- Start/end: exact approved KF-04 and KF-05 of the same composition.
- Motion: reveal follows the transition edge; gait remains continuous; architecture appears by uncovering, not construction/morph.
- Geometry/light: fixed resort anchors and sun direction; coherent path contact, foliage/water response, shadows/reflections.
- Preserve: identity/proportion/resort outfit/screen direction/camera relationship; converge on exact KF-05.
- Prevent: dissolve/teleport, wardrobe morph, face change, architecture growth, random flare, orange skin, logo/text/audio.
- Test: 4–6 s.

## VID-RST-{D|M}-002 — KF-05 to KF-06

- Purpose: continue through resort and settle into approved final composition/glance.
- Start/end: exact same KF-05 hash used above, then approved KF-06.
- Motion: biomechanically plausible final steps and controlled settle; subtle environment motion only.
- Geometry/light: anchors/time/day/sun fixed; camera uses only approved settle.
- Preserve: identity, expression range, hands/feet, garment, CTA-safe background, final frame.
- Prevent: pose teleport, exaggerated smile/teeth defects, foot slide, camera orbit, anchor drift, busy CTA region, audio.
- Test: 3–5 s.

## Delivery and editorial assembly

- COMPLETE — four accepted segments per composition were assembled into separate 20.125-second, 24 fps silent deliveries.
- Cut between KF-03 and KF-04 only inside matched full black.
- Apply a deterministic full-black finish at the hidden cut so the assembly does not depend on residual provider interpolation.
- COMPLETE — H264 and VP9 preview derivatives were produced without audio; all four are under 4.3 MB and the six-asset delivery contract is verified.
- Keep masters and derivatives protected-preview-only until the production release gate passes.

## Attempt review

For every frame sequence inspect identity, gait/contact, hands/feet/teeth, garment physics, fixed geometry, camera, light/shadow/reflection, boundary convergence, transition coverage, temporal flicker, brand/text artifacts, and desktop/mobile-specific safe areas. Log every failure and prompt/settings delta in manifests/generations.json.
