# Runway Environment Prompt Specifications

Every asset below inherits the numbered twenty-field contract and shared visual/negative blocks in ../../07-image-prompts.md. Because these are empty-set assets, field 3 is “no person; identity lock not applicable” unless a scale figure is explicitly approved. Field 7 is limited to unbranded material/fabric studies.

## Shared fields 2–20

2. Inputs: only owner-approved architecture/material references; references control named geometry/material qualities, never venue identity or branding.
3. Identity: no person in empty plates/maps; later overlays use CHR-SAGE-CONT-001.
4. Scene: premium near-dark contemporary runway, not a named venue/show.
5. Placement/scale: metric-feeling proportions and fixed centerline; human scale must be plausible.
6. Performance: no subject/crowd; fixtures change only in light-state assets.
7. Wardrobe/material: graphite floor, dark mineral/panel walls, matte ceiling, blackened metal, approved black occlusion fabric where requested.
8. Camera: level, straight center axis unless the diagnostic view specifies top/side; natural rectilinear lens; no stylized distortion.
9. Output: diagnostic 16:9 or 9:16 master as named; safe zones/targets recorded; no text inside generated pixels.
10. Geometry: entrance, runway edges, joints, fixtures, ceiling, horizon/vanishing point, and occlusion zone remain fixed.
11. Light: physically located fixtures and coherent shadow/reflection states.
12. Palette: near-black, graphite, cool neutral, restrained metal; diagnostic outputs remain grade-neutral.
13. Layers: foreground runway, middle set/subject zone, background entrance; no decorative clutter.
14. Continuity: ENV-RUNWAY-001 is canonical; every derivative preserves its anchors.
15. Preserve: runway width, fixture rhythm, entrance aperture, camera axis/height, material assignments.
16. Prevent: logos/text/watermarks, crowd mutations, impossible scale, changing fixtures, multiple vanishing points, mirror-floor errors.
17. Output: individual lossless review file, hash, prompt/settings record, and later optimized derivative only after approval.
18. Downstream: environment review, keyframes, interpolation anchors, web poster/video.
19. Review: geometry overlay, fixture/material consistency, physical light/reflection, safe zones, brand clearance.
20. Provenance/rights/state: PROPOSED; private; no named venue imitation; exact references and rights logged before use.

## Individual specifications

| Field 1 asset/purpose | Field 4 scene override | Field 5/8 composition and camera | Field 9 output | Field 11 light | Field 14 continuity / field 19 review |
|---|---|---|---|---|---|
| ENV-RUNWAY-001 empty master | Full canonical set from hero axis | Centered one-point perspective; camera height and lens candidate recorded | 16:9 high-resolution empty plate | Dormant neutral baseline with readable geometry | Source of all anchor coordinates; approve geometry before any other view |
| ENV-RUNWAY-002 floor plan | Same set represented top-down | True orthographic/top-down; show runway, subject marks, fixtures, occlusion zone | Diagnostic plan; labels added later outside pixels | Lighting positions shown as geometry, not glows | Measurements must reconcile with master/elevation |
| ENV-RUNWAY-003 side elevation | Same set in orthographic side view | Level side elevation; camera/subject marks/ceiling/floor relationships | Diagnostic elevation | Fixture heights/angles visible as geometry | Scale and camera height must reconcile with floor plan/master |
| ENV-RUNWAY-004 camera-path diagram | Derived deterministic diagram, not a generative scene | Plot locked camera plus subject Marks A/B/C and field of view | SVG/diagram created from approved geometry; no generation | Not applicable | Reject any diagram that invents measurements |
| ENV-RUNWAY-005 material sheet | Neutral material samples from canonical set | Orthographic swatches and close details, consistent scale | Review sheet plus individual swatches | Neutral reveal light, black detail preserved | Approve floor reflectance and fabric black before lighting/transition |
| ENV-RUNWAY-006 desktop anchor map | Derived from approved 16:9 master | Overlay percentage coordinates and 5% safety outside media | Deterministic annotated diagram | Reference only | Must name every fixed anchor and copy-safe region |
| ENV-RUNWAY-007 mobile anchor map | Re-authored 9:16 camera in same set | Tall composition, 8% side safety, browser/CTA clearance | 9:16 empty plate plus deterministic overlay | Same physical fixture logic | Must not be a crop of ENV-RUNWAY-001 |
| LIGHT-RUNWAY-001 dormant | Canonical set, fixtures off/barely embered | Exact approved camera/geometry | 16:9 and 9:16 lighting plates | Low ambient plus subtle subject-separation source | Compare anchor pixels and floor reflection to ENV master |
| LIGHT-RUNWAY-002 partial ignition | Same set during controlled activation | Exact approved camera/geometry | 16:9 and 9:16 lighting plates | Explicit sequential practical activation and matching reflections | Fixture count/location cannot change |
| LIGHT-RUNWAY-003 near-camera | Same set immediately before coverage | Exact approved camera/geometry | 16:9 and 9:16 transition lighting plates | Identity-readable near-camera exposure, then black target | Must grade-match transition black |
| TRANS-OCCLUSION-001 | Approved black fabric crossing near lens | Macro/near-lens directional coverage study at locked edge path | Desktop and mobile edge/coverage sequence reference | Controlled edge separation collapsing to neutral black | Review 98–100% coverage, edge direction, blur, no hard hardware |

## Runnable prompt assembly example

Field 1 + global visual prefix + shared fields 2–20 + the exact row overrides forms one prompt specification. Before a provider run, convert diagrams that require exact measurements to deterministic SVG/CAD-style drawings rather than asking a generator to invent readable labels or dimensions.
