# Runway Environment Bible

Status: PROPOSED. The runway is a reproducible set with fixed geometry and lighting—not a fresh environment prompt per keyframe.

## Design intent

A premium, near-dark fashion runway with disciplined one-point perspective, plausible architectural scale, restrained materials, and practical fixtures that awaken as Sage approaches. It should feel editorial and contemporary without copying a named venue, campaign, designer, or show.

## Fixed geometry

Canonical environment ID: ENV-RUNWAY-001

- Straight runway centered on a single camera axis.
- Camera and runway centerlines remain coincident from KF-01 through KF-03.
- Runway width, entrance aperture, ceiling height, audience/setback zones, wall joints, fixture rhythm, and vanishing point are fixed.
- Lens height is approximately waist-to-sternum level relative to Sage, selected during empty-plate review and then locked.
- No audience is required; an empty or shadowed architectural space keeps continuity tractable.
- Near-camera occlusion zone is marked on the floor plan and kept free of hard foreground objects.

Planned controlled views:

| ID | View | Purpose |
|---|---|---|
| ENV-RUNWAY-001 | Empty master wide | Canonical geometry and hero camera |
| ENV-RUNWAY-002 | Top-down floor plan | Subject path, fixture grid, occlusion zone |
| ENV-RUNWAY-003 | Side elevation | Camera height, ceiling, entrance, subject scale |
| ENV-RUNWAY-004 | Camera-path diagram | Locked axis and subject distances for KF-01–03 |
| ENV-RUNWAY-005 | Material sheet | Floor, wall, ceiling, metal, black fabric |
| ENV-RUNWAY-006 | Anchor map desktop | Pixel/percentage anchor positions at 16:9 |
| ENV-RUNWAY-007 | Anchor map mobile | Re-authored anchor positions at 9:16 |

## Material system

- Floor: dark graphite, low-to-medium gloss, physically consistent reflections; never mirror-like.
- Walls: charcoal mineral/plaster or restrained dark paneling.
- Ceiling: matte black with integrated fixture rhythm.
- Metal: blackened steel or dark brushed metal; minimal specular accents.
- Occluding fabric: true black in exposure, soft controlled edge, enough body to cover frame without noisy transparency.
- Avoid branded venue cues, decorative clutter, random signage, text, and impossible reflective duplication.

## Lighting states

### LIGHT-RUNWAY-001 — dormant

- Low ambient exposure preserves architecture and Sage silhouette without revealing unsupported facial detail at distance.
- Practical fixtures appear off or barely embered.
- A subtle controlled back/edge source separates subject from the entrance.
- Floor reflections are weak but geometrically aligned.

### LIGHT-RUNWAY-002 — partial ignition

- Practical activation progresses from the entrance toward camera or in a clearly specified sequential rhythm.
- Key/fill relationship reveals identity only as subject scale supports it.
- Reflections, fixture emissions, and shadows correspond spatially.
- No random light relocations or overexposed face.

### LIGHT-RUNWAY-003 — near-camera transition

- Near-camera subject remains legible immediately before coverage.
- Black occluder reaches a defined black-level target while an approved edge direction carries motion into KF-04.
- No visible fixture or skin fragment persists after full coverage.

## Camera contract

- Hero axis: fixed, straight down runway.
- Lens family: natural editorial compression; begin tests around a 50–65 mm full-frame equivalent, then lock one value from geometry review.
- Aperture/depth: enough depth for spatial legibility; do not create synthetic razor-thin focus during approach.
- Camera movement: locked or minimal controlled dolly; subject motion supplies the primary scale change.
- Horizon and vanishing point: fixed by composition; no roll or lens-family jump.
- Shutter intent: crisp gait in KF-01/02, directional blur only in the approved KF-03 occluding edge.
- Desktop and mobile may use different camera distance/framing but must preserve the same physical set and screen direction.

## Subject marks

Exact distances are selected after the source-controlled proportion sheet:

- Mark A / KF-01: far entrance, full silhouette readable.
- Mark B / KF-02: mid-to-near runway, identity and gait readable.
- Mark C / KF-03: near-camera coverage zone, body scale plausible before occlusion.

The manifest records measured subject-height percentage and foot position for each composition.

## Transition contract

Canonical transition ID: TRANS-OCCLUSION-001

- Primary occluder: approved black runway fabric.
- Optional secondary edge: approved hair silhouette only if it remains controllable.
- Screen direction: constant across KF-02 → KF-03 → KF-04.
- Coverage: expand from defined edge to 98–100% frame coverage.
- Black target: visually continuous across the hidden cut after grade.
- Edge: soft enough to hide interpolation defects, structured enough to read as physical fabric.
- Blur: follows the actual occluder direction.
- Match: KF-04 warm leak enters from the same edge and motion direction.
- Editorial cut is placed only inside full black coverage.

## Desktop composition

- 16:9, one-point perspective, centered subject path.
- Reserve one owner-approved copy-safe region without weakening the runway vanishing point.
- Critical fixtures, body, and transition edge remain inside 5% action safety.
- The composition must still work if text wraps one additional line.

## Mobile composition

- 9:16 authored from the physical set, not cropped.
- Runway width and fixture rhythm are adjusted through camera position, not warped architecture.
- Reserve top browser-chrome and lower gesture/CTA clearances.
- Keep face, hands, feet, and the entire occlusion edge inside 8% side safety.

## Review checklist

- One vanishing point and consistent horizon.
- Same runway width, entrance, fixture count/rhythm, materials, and camera axis.
- Physically plausible subject scale at all marks.
- Lighting activation corresponds to fixtures and floor reflections.
- No logos, signs, text, watermarks, audience mutations, or unexplained objects.
- Occlusion reaches a clean editorial-cut interval.
- Desktop/mobile depict the same world while using intentional compositions.
