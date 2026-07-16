# Video Shot Plan and Higgsfield Compatibility

Research date: 2026-07-16

Decision: Architecture B — four start/end interpolated segments per composition, with a hidden editorial cut between KF-03 and KF-04.

Status: Evidence-backed video plan plus a blocked Soul preflight. No authenticated account UI, provider upload, cost reservation, Soul creation, Higgsfield diagnostic, or credit spend occurred.

## Official evidence

Primary operational sources:

- Current CLI model schemas: https://github.com/higgsfield-ai/cli/blob/main/MODELS.md
- Current generation skill and media-role rules: https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md and https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/media-inputs.md
- Workflow catalog: https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/workflows.md
- Soul ID skill v0.12.0: https://github.com/higgsfield-ai/skills/blob/main/higgsfield-soul-id/SKILL.md
- Kling 3 product information: https://higgsfield.ai/kling-3.0
- Popcorn storyboard information: https://higgsfield.ai/storyboard-generator
- Camera-control catalog: https://higgsfield.ai/camera-controls
- CLI/MCP and cost surfaces: https://higgsfield.ai/cli and https://higgsfield.ai/mcp
- Terms: https://higgsfield.ai/terms-of-use-agreement

Official schemas expose start-image and, on selected models, end-image roles. They also expose unordered references, multi-prompt, multi-shot, storyboards, or camera cuts on some workflows. None is documented as an ordered middle-image temporal anchor. A multi-shot prompt or six camera cuts is not six ordered keyframe images.

## Local integration state

- No higgsfield executable on PATH.
- No installed Higgsfield skill or configured Higgsfield MCP connector.
- Official remote MCP exists but requires account OAuth.
- The authenticated account surface needed to confirm the current Soul form, file acceptance, visibility, balance, and signed-in charge was unavailable.
- Exact authenticated account schema and current per-job cost were not accessed.
- Official CLI current release observed in the audit: v1.1.13, dated 2026-07-11.

No local integration was installed and no provider state was changed.

## Compatibility matrix

“Unknown” means the official public schema did not state the value; it does not mean unlimited or supported.

| Model/workflow | Start | End | Ordered middle | Soul/character input | Camera control | Duration | Resolution / aspect | Prompt / negative / seed | Cost | Recommended role / limitation |
|---|---:|---:|---:|---|---|---|---|---|---|---|
| seedance_2_0 | Yes | Yes | No | Unordered refs; no direct Soul ID field in video schema | Prompt/preset-routing; no documented numeric camera API | 4–15 s | 480/720/1080/4K; auto, 21:9, 16:9, 9:16, 4:3, 3:4, 1:1 | String prompt; public limit unknown; no negative field; no seed | Dynamic/account-gated | Primary feasibility candidate for start/end segments; max 9 images including anchors, 3 videos, 3 audio, 12 refs total |
| seedance_2_0_mini | Yes | Yes | No | Same reference-count pattern; no direct Soul field | Similar prompt-led control | Default 5 s; max unstated | 480/720; same broad aspect family | Limits unknown; no negative/seed field | Dynamic/account-gated | Potential lower-output validation candidate; preflight exact availability/cost |
| cinematic_studio_video_3_5 | Yes | Yes | No | Unordered refs, max 15 total; no direct Soul field | Nine schema camera styles, six light schemes, eight grades, multi-shot | Default 15 s; max unstated | 480/720/1080; broad aspect family including 16:9/9:16 | Limits unknown; no negative/seed field | Dynamic/account-gated | Alternative when explicit camera-style control outweighs 4K; style controls can conflict with inline prompt |
| cinematic_studio_3_0 | Yes | Yes | No | Unordered image/video/audio refs, max 15 | Multi-prompt, multi-shot, genre, speed-ramp, preset ID | Default 5 s; max unstated | 480/720/1080/4K; broad aspect family | Limits unknown; no negative/seed field | Dynamic/account-gated | Alternate start/end route; no middle anchor |
| kling3_0 | Yes | Yes | No | No direct Soul field documented | Up to six camera cuts in UI; not image anchors | Up to 15 s | std/pro/4K; 16:9/9:16/1:1 | Limits unknown; no negative/seed field in current schema | Dynamic/account-gated | Lower-complexity alternative; cuts do not satisfy three-keyframe control |
| seedance1_5 | Yes | Yes | No | No direct Soul field | Prompt-led | 4/8/12 s | 480/720/1080; broad aspect family | Limits unknown; no negative/seed | Dynamic/account-gated | Fallback only after current-model comparison |
| veo3_1_lite | Yes | Yes | No | No direct Soul field | Limited documented control | 4/6/8 s; both anchors force 8 s | 16:9/9:16/auto; resolution unstated | Limits unknown; no negative/seed | Dynamic/account-gated | Technically anchor-compatible, but fixed 8 s with both anchors may be inefficient |
| marketing_studio_video | Yes | Yes | No | Unordered refs/storyboard entities, not ordered anchors | Storyboard/ad controls | Default 15 s | 480/720/1080; broad aspect family | Limits unknown; no negative/seed | Dynamic/account-gated | Not selected; ad workflow adds irrelevant complexity |
| Popcorn storyboard | Storyboard still creation | No video temporal-anchor claim | No | Character-consistent storyboard claim, not direct ordered video ingestion | Storyboard composition | Up to 8 stills, then export toward Sora prompt | Still-workflow dependent | Public limits not sufficient for this plan | Account-gated | Useful ideation only; not evidence for Architecture A |
| draw_to_video workflow | Existing video required | One sketch at one timestamp | No | Not an identity solution | Local edit at a time point | Existing-video dependent | Workflow dependent | Unknown | Account-gated | Repair workflow, not three-keyframe generation |
| reframe workflow | Existing video required | Not applicable | No | Not applicable | Reformat only | Existing-video dependent | Reformat target | Unknown | Account-gated | Delivery utility, not generation architecture |

Other current video schemas audited either provide only a start image, unordered references without temporal roles, or utility/analysis functions. None provides a documented ordered start/middle/end image triplet.

## Soul ID and identity route

Current official operational Soul guidance reviewed on 2026-07-16 is internally sufficient for input planning:

- Soul skill v0.12.0 accepts 5–20 photos and reports an error below 5 unique faces.
- The official photo guide states minimum 5, maximum 20, and an 8–12 sweet spot; it accepts JPEG/PNG and describes 1024 x 1024 or greater as ideal, not mandatory.
- The default is `--soul-2` for image-focused work and `--soul-cinematic` for cinematic/video work. Project Saite selects `--soul-cinematic`.
- All thirteen originals are JPEG and 2001 x 3000 or larger. They fit the operational count, format, and ideal-resolution guidance without additional photos or transformation.

A separate June 29 marketing article/public upload UI says 20 or more are recommended, up to 80 may be used, 960 px or greater is optimal, and 25 credits are displayed. That conflicting marketing guidance is not the versioned operational minimum or maximum. The unavailable authenticated interface still prevented confirmation of exact signed-in file acceptance, paid Basic+ plan eligibility, balance/final charge, and explicit private visibility/terms.

The owner-authorized input contract selects SRC-SAGE-001 through SRC-SAGE-013 collectively as original, unchanged photographs. Small faces, full-body compositions, unusual poses, expressions, hairstyles, postures, and different sessions remain part of the intended evidence. Owner/project policy also permits incidental visible branding in the intended private input set, but provider acceptance remains unverified and may be filtered or rejected. SRC-SAGE-014 and every generated candidate are excluded. Candidate 003 is a secondary human-review clue only.

The evidence-backed path is therefore:

thirteen unchanged originals → one private Soul → seven source-reviewed diagnostics → owner decision → later anchor stills → start/end video segments

One `--soul-cinematic` Soul and the seven-output diagnostic are authorized, but the path is blocked before upload. Photographer/source identity and copyright/license remain UNKNOWN, while Higgsfield's terms require sufficient uploader rights and grant the provider broad rights to uploaded content and identity-related processing. Sage's likeness consent does not by itself resolve that source-license conflict. Exact signed-in file acceptance, paid Basic+ plan eligibility, balance/final charge, branded-input handling, provider-policy acceptance, and explicit private visibility/terms also remain unverified. Current totals are zero uploads, zero Souls, zero diagnostics, and zero recorded Higgsfield credits.

## Why Architecture A is rejected

Architecture A needs two clips with reliable ordered visual control at start, middle, and end:

- KF-01 → KF-02 → KF-03
- KF-04 → KF-05 → KF-06

No current public Higgsfield schema exposes a middle-image or timestamped ordered keyframe array. Unordered references may influence content, while multi_prompt, multi_shots, Popcorn frames, and Kling camera cuts control story/camera behavior. None proves that KF-02 or KF-05 can be locked at a temporal midpoint. Architecture A is therefore unsupported, not merely untested.

## Selected Architecture B

Each exact boundary still is reused byte-for-byte where two adjacent segments meet.

| Segment ID | Composition | Start → end | Initial test length | Motion purpose |
|---|---|---|---|---|
| VID-RWY-D-001 | desktop 16:9 | KF-01 desktop → KF-02 desktop | 4–6 s | Far approach and light ignition |
| VID-RWY-D-002 | desktop 16:9 | KF-02 desktop → KF-03 desktop | 3–5 s | Near approach and full black occlusion |
| hidden desktop cut | desktop | KF-03 black → KF-04 matched black | editorial | Wardrobe/world change concealed only in full coverage |
| VID-RST-D-001 | desktop 16:9 | KF-04 desktop → KF-05 desktop | 4–6 s | Warm leak into full resort reveal |
| VID-RST-D-002 | desktop 16:9 | KF-05 desktop → KF-06 desktop | 3–5 s | Continue and settle/glance-back |
| VID-RWY-M-001 | mobile 9:16 | KF-01 mobile → KF-02 mobile | 4–6 s | Mobile-authored far approach/ignition |
| VID-RWY-M-002 | mobile 9:16 | KF-02 mobile → KF-03 mobile | 3–5 s | Mobile-authored approach/occlusion |
| hidden mobile cut | mobile | KF-03 black → KF-04 matched black | editorial | Full-height concealed change |
| VID-RST-M-001 | mobile 9:16 | KF-04 mobile → KF-05 mobile | 4–6 s | Mobile warm reveal |
| VID-RST-M-002 | mobile 9:16 | KF-05 mobile → KF-06 mobile | 3–5 s | Mobile settle |

Although six anchor moments exist, the hidden cut separates two three-anchor groups. Four generated segments per composition are correct: two runway intervals and two resort intervals.

## Test order

1. Resolve documentary upload rights for all thirteen originals.
2. Regain the authenticated account UI and confirm exact acceptance of all thirteen unchanged files, paid Basic+ plan eligibility, balance/final charge, branded-input handling, provider-policy acceptance, and explicit private visibility/terms.
3. Create no more than one `--soul-cinematic` Soul and generate only the seven diagnostics in prompts/character/soul-diagnostic.md.
4. Compare the diagnostic against all thirteen originals and record one allowed decision. Candidate 003 is secondary preference evidence only.
5. Stop for owner review. Do not create keyframes or videos unless the diagnostic is approved.
6. After later keyframe authority and approval, run a read-only cost preflight for one 720p or 1080p desktop segment using the exact selected model/settings.
7. Obtain explicit credit approval for that video amount and test scope.
8. Test VID-RWY-D-001 only, review it, and change one documented variable group per rerun.
9. Test remaining desktop segments only after the first passes; test mobile separately and never reframe desktop as its master.

## Editorial and delivery hypothesis

- Silent 24 fps master.
- Final scroll-controlled duration target: approximately 12–18 seconds after retiming, not the raw sum of generated durations.
- Cut only inside matched full black.
- Offline operations: trim, retime, stabilize, defect paintover/composite, boundary blending, color match, and grain/texture coherence.
- No generated audio; no audio-dependent storytelling.
- Preserve high-quality archival masters privately, then create separate web derivatives.

## Reproducibility limitations

Current public video schemas expose no seed field and no universal negative-prompt field. Even identical inputs/settings may not rerun deterministically. Reproducibility therefore means exact input hashes, prompt hash, model/workflow/settings, job ID, date, cost, and output hash—not a promise of pixel-identical regeneration.

## Cost, rights, and privacy

- The separate marketing/public UI displays 25 credits, but the exact signed-in one-run charge, current balance, and diagnostic-generation charges remain account-gated. Use the authenticated cost display before submission; no provider operation is confirmed affordable until that evidence is available.
- Higgsfield’s terms state it does not claim ownership of inputs/outputs or restrict commercial output use.
- The same terms grant broad rights over uploaded/generated content and permit uses including model development/training and marketing/promotion.
- The user remains responsible for likeness, copyright, trademark, and third-party rights.
- Commercial-use language is not a warranty of originality or non-infringement.

Result: Architecture B remains technically credible as a later video plan. The newly authorized Soul route is BLOCKED before upload by UNKNOWN photographer/source rights, the provider license/identity-processing conflict, and unavailable authenticated preflight. Nothing was uploaded, trained, generated, or charged.
