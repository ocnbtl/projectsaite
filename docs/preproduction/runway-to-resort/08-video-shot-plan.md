# Video Shot Plan and Higgsfield Compatibility

Research date: 2026-07-16

Decision: Architecture B — four start/end interpolated segments per composition, with a hidden editorial cut between KF-03 and KF-04.

Status: EXECUTED AND VERIFIED THROUGH PROTECTED-PREVIEW DELIVERY. Architecture B produced eight accepted silent 1080p segments—four desktop and four mobile—from the twelve selected anchors. Separate H264/VP9 desktop and mobile deliveries verify at 20.125 seconds and 24 fps; production release remains gated.

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

- The official Higgsfield CLI was used through an authenticated private provider session; credentials and provider-private identifiers remain outside Git.
- Authenticated provider execution accepted all thirteen unchanged originals, completed one Soul Cinematic model, and completed seven private Soul Cinema diagnostics.
- Private provider identifiers and account details remain outside Git.
- Official CLI current release observed in the audit: v1.1.13, dated 2026-07-11.

Provider state was changed only within the explicitly authorized private workflow. No production website, domain, Blob, email, or deployment state was changed.

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

A separate June 29 marketing article/public upload UI says 20 or more are recommended, up to 80 may be used, 960 px or greater is optimal, and 25 credits are displayed. That conflicting marketing guidance is not the versioned operational minimum or maximum. Execution established that all thirteen supplied originals were accepted and that the completed training charge was 25 credits.

The executed input contract used SRC-SAGE-001 through SRC-SAGE-013 collectively as original, unchanged photographs. Small faces, full-body compositions, unusual poses, expressions, hairstyles, postures, different sessions, and incidental source branding remained part of the accepted evidence. SRC-SAGE-014 and every generated candidate were excluded. Candidate 003 is a secondary human-review clue only.

The executed path is:

thirteen unchanged originals → one private Soul → seven source-reviewed diagnostics → twelve selected anchors → eight reviewed start/end segments → protected-preview delivery assembly

One `--soul-cinematic` Soul completed from all thirteen direct unchanged originals at 25 credits. Seven private Soul Cinema diagnostics completed at 0.84 gross credits. A separate concurrent 10-credit provider reward explains the net increase without recording any account balance. Complete workflow authority is confirmed. The diagnostic decision is `APPROVED FOR KEYFRAME DEVELOPMENT`; original photos remain authoritative, Candidate 003 remains comparison-only, and DIAG-04 is rejected as a downstream reference because it invented tattoos.

## Why Architecture A is rejected

Architecture A needs two clips with reliable ordered visual control at start, middle, and end:

- KF-01 → KF-02 → KF-03
- KF-04 → KF-05 → KF-06

No current public Higgsfield schema exposes a middle-image or timestamped ordered keyframe array. Unordered references may influence content, while multi_prompt, multi_shots, Popcorn frames, and Kling camera cuts control story/camera behavior. None proves that KF-02 or KF-05 can be locked at a temporal midpoint. Architecture A is therefore unsupported, not merely untested.

## Selected Architecture B

Each exact boundary still is reused byte-for-byte where two adjacent segments meet.

| Segment ID | Composition | Start → end | Initial test length | Motion purpose |
|---|---|---|---|---|
| VID-RWY-D-001 | desktop 16:9 | KF-01 desktop → KF-02 desktop | 5 s / PASSED | Far approach and light ignition |
| VID-RWY-D-002 | desktop 16:9 | KF-02 desktop → KF-03 desktop | 5 s / PASSED | Near approach and full black occlusion |
| hidden desktop cut | desktop | KF-03 black → KF-04 matched black | editorial | Wardrobe/world change concealed only in full coverage |
| VID-RST-D-001 | desktop 16:9 | KF-04 desktop → KF-05 desktop | 5 s / PASSED | Warm leak into full resort reveal |
| VID-RST-D-002 | desktop 16:9 | KF-05 desktop → KF-06 desktop | 5 s / PASSED | Continue and settle/glance-back |
| VID-RWY-M-001 | mobile 9:16 | KF-01 mobile → KF-02 mobile | 5 s / PASSED | Mobile-authored far approach/ignition |
| VID-RWY-M-002 | mobile 9:16 | KF-02 mobile → KF-03 mobile | 5 s / PASSED | Mobile-authored approach/occlusion |
| hidden mobile cut | mobile | KF-03 black → KF-04 matched black | editorial | Full-height concealed change |
| VID-RST-M-001 | mobile 9:16 | KF-04 mobile → KF-05 mobile | 5 s / PASSED | Mobile warm reveal |
| VID-RST-M-002 | mobile 9:16 | KF-05 mobile → KF-06 mobile | 5 s / PASSED replacement | Mobile settle; one prior provider failure was fully refunded |

Although six anchor moments exist, the hidden cut separates two three-anchor groups. Four generated segments per composition are correct: two runway intervals and two resort intervals.

## Test order

1. COMPLETE — all thirteen unchanged originals accepted; one `--soul-cinematic` Soul completed.
2. COMPLETE — seven diagnostics generated and compared against all thirteen originals.
3. COMPLETE — decision recorded as `APPROVED FOR KEYFRAME DEVELOPMENT`; Candidate 003 remained secondary preference evidence only.
4. COMPLETE — twelve desktop/mobile keyframes selected: six controlled GPT Image 2 corrections, four deterministic transition anchors, and KF-06 desktop v4/mobile v5.
5. COMPLETE — exact Seedance 2.0 cost preflight established 45 credits per five-second 1080p silent segment.
6. COMPLETE — four desktop and four separately authored mobile segments generated and reviewed.
7. COMPLETE — one mobile resort-resolve provider failure was fully refunded; one bounded replacement passed.
8. COMPLETE — separate 20.125-second, 24 fps silent desktop/mobile H264 and VP9 derivatives verified; all four are under 4.3 MB and remain protected-preview-only.

## Editorial and delivery hypothesis

- Separate silent 20.125-second, 24 fps desktop and mobile deliveries.
- Cut only inside matched full black.
- Offline operations: trim, retime, stabilize, defect paintover/composite, boundary blending, color match, and grain/texture coherence.
- No generated audio; no audio-dependent storytelling.
- Preserve high-quality archival masters privately, then create separate web derivatives.

## Reproducibility limitations

Current public video schemas expose no seed field and no universal negative-prompt field. Even identical inputs/settings may not rerun deterministically. Reproducibility therefore means exact input hashes, prompt hash, model/workflow/settings, job ID, date, cost, and output hash—not a promise of pixel-identical regeneration.

## Cost, rights, and privacy

- Executed spend is 427.84 credits: 25 Soul training, 0.84 diagnostics, 42 controlled keyframe corrections, and 360 across eight accepted motion segments. One additional 45-credit failed motion attempt was fully refunded. A separate concurrent provider reward granted 10 credits; no account balance is stored in Git.
- Higgsfield’s terms state it does not claim ownership of inputs/outputs or restrict commercial output use.
- The same terms grant broad rights over uploaded/generated content and permit uses including model development/training and marketing/promotion.
- The user remains responsible for likeness, copyright, trademark, and third-party rights.
- Commercial-use language is not a warranty of originality or non-infringement.

Result: Architecture B is validated through delivery. All eight successful segments passed structural and contact-sheet visual review, deterministic full black is applied at the hidden cut, and the six-asset poster/video contract reports `DELIVERY_ASSETS_VERIFIED`. The H264/VP9 derivatives remain protected-preview-only; production deployment and merge remain unperformed pending the release gate.
