# Runway-to-Resort Preproduction Brief

Last verified: 2026-07-16 America/New_York

Primary mode: Brand / visual system

Overlay: Cinematic identity, continuity, and web-delivery preproduction

Current scope: Completed all-original Soul Cinematic identity workflow; selected all twelve desktop/mobile keyframe anchors; completed and reviewed eight silent 1080p motion segments; completed and verified six protected-preview delivery assets; website integration and preview QA continue while private source/provider artifacts remain outside Git

Site implementation: Authorized for local and nonproduction preview work; production release remains gated

## 1. Executive design brief

Create a premium, silent Runway-to-Resort hero concept for Sage Burress. The visual arc begins in a near-dark architectural runway, advances through a controlled near-lens black occlusion, and resolves in a bright, plausible tropical resort. The cinematic must feel like one continuous person, path, camera logic, and editorial idea—not two unrelated generated clips.

The approved creative direction is:

1. Runway dormant.
2. Runway ignition.
3. Lens occlusion.
4. Resort light leak.
5. Resort reveal.
6. Resort resolve.

Desktop uses an art-directed 16:9 composition. Mobile uses a separately art-directed 9:16 composition; it is never a center crop of desktop.

## 2. Verified operating baseline

| Surface | Verified state | Consequence |
|---|---|---|
| Canonical durable clone | Permanent local repository; absolute path intentionally omitted from Git | Use for Git truth; do not work in the iCloud-backed clone. |
| GitHub main | 9fd78cba75f1f690172f522e4b96c99a743cdf47 | Matches clean local main, 0 ahead / 0 behind. |
| Admin-integrity branch | 08e755a31c0a677c81a26ad130a9cd3775138972 | Verified separate branch/preview evidence; its application changes are intentionally not inherited here. |
| Canonical preproduction branch | codex/runway-resort-preproduction-main, based directly on GitHub main | Contains only the approved text-only preproduction system. |
| Isolated worktree | Permanent sibling worktree; absolute path intentionally omitted from Git | Durable local work surface; no production mutation. |
| Production Vercel artifact | READY deployment dpl_DRHiUoDwz4DtK6wE4Minb4ibXpYZ at 9fd78c | Production remains unchanged. |
| Admin-integrity preview | READY deployment dpl_4X5jQFhiZXu4NzTcSzt2SQpJA4re at 08e755a | Preview remains unchanged. |
| Current browser access | Vercel Authentication redirects public unauthenticated requests | Content behavior behind the provider gate cannot be treated as publicly verified. |
| Custom domain | sageburress.com and www present an expired certificate; bypassing TLS reaches the old GoDaddy DPS site, not this Vercel project | Public custom-domain behavior is degraded and belongs to a separate legacy surface. |
| Source batch | Fourteen media files were privately materialized and hashed: thirteen original photographs and one AI-generated media-kit artifact; no exact or screened near duplicates were found | All thirteen originals collectively remain the authoritative identity/proportion set. Each was submitted unchanged and accepted. The media-kit artifact and every generated candidate were excluded. |
| Higgsfield Soul execution | One private `--soul-cinematic` run used all thirteen unchanged originals; one Soul completed at 25 credits; seven private diagnostics completed at 0.84 gross credits | Diagnostic decision: `APPROVED FOR KEYFRAME DEVELOPMENT`. A separate concurrent 10-credit provider reward is recorded without storing an account balance. |
| Keyframe execution | Twelve selected anchors: six GPT Image 2 high/2k corrections at 42 gross credits, four deterministic transition anchors at zero cost, and accepted KF-06 desktop v4/mobile v5 resolves | Exact private binaries and fingerprints remain outside Git; all twelve passed selection review for protected-preview assembly. |
| Motion execution | Eight successful silent Seedance 2.0 start/end segments: four 16:9 desktop and four 9:16 mobile, each 5 seconds at 1080p standard/high-bitrate and 45 credits | All eight passed structural and contact-sheet visual review. One failed mobile resort-resolve attempt was fully refunded; one bounded replacement passed. |
| Delivery assembly | Separate desktop/mobile H264 and VP9 preview derivatives are complete at 20.125 seconds and 24 fps; all four video derivatives are under 4.3 MB; the full poster/video delivery contract verifies six assets | Deterministic full black is applied at the hidden cut; visibility remains protected-preview-only. Production and main remain unchanged. |

## 3. Contradictions and unknowns

- The provider project record reports live=false while a READY target=production deployment and production aliases exist. Deployment identity, not the ambiguous live flag, is the stronger evidence.
- The custom domain is not attached to the Vercel project. Behind its expired certificate, the apex serves an older GoDaddy DPS site with a different route set; it is not evidence of current Project Saite application behavior.
- The older iCloud-backed checkout is dirty and stale. It is preserved intact and is not a source of Git truth.
- All supplied media is readable, but the photographs use materially different grades, styling, retouching, poses, and sessions, and none provides a true left or right profile. That variation is intentionally retained in the collective authoritative set; it must not be normalized away or replaced with generated inference.
- Complete likeness, photographer, copyright, commercial-use, provider-upload, and publication authority is confirmed for the Project Saite workflow.
- The supplied media-kit artifact carries trained-algorithmic-media provenance and unverified promotional claims. It is context only, not independent photographic identity evidence.
- The versioned operational guidance and the provider's separate marketing surfaces conflict: a June 29 marketing article/public upload UI recommends 20 or more, says up to 80, describes 960 px or greater as optimal, and displays 25 credits. Those marketing statements are not the hard operational requirement and do not make thirteen photos insufficient.
- Current official schemas expose start and end visual anchors and unordered reference inputs, but no ordered middle-keyframe parameter. Multiple prompt beats or camera cuts are not equivalent to three temporal image anchors.
- The completed training charge was 25 credits, and the seven diagnostics spent 0.84 gross credits. A separate 10-credit provider reward must not be conflated with spend.
- The verified editorial result is 20.125 seconds at 24 fps for each silent composition. All four video derivatives are under 4.3 MB; browser behavior remains subject to protected-preview QA.

## 4. Decision ledger

| Scope | State | Evidence / boundary |
|---|---|---|
| Runway-to-Resort creative direction | APPROVED FOR EXECUTION | Keyframe, video, and site-preview campaign is authorized. |
| Six-beat narrative contract | APPROVED FOR EXECUTION | KF-01 through KF-06 are required. |
| Architecture B: four start/end segments per composition | EXECUTED / REVIEWED | Eight successful Seedance 2.0 segments passed structural and contact-sheet review; the hidden cut uses deterministic full black. |
| Face identity diagnostic | REVIEWED / PROPOSED | Three private OpenAI candidates were generated under one prompt. The user prefers attempt 003 as the closest facial interpretation; the prior attempt-002 recommendation is superseded. Attempt 003 remains comparison-only, non-authoritative, and ineligible for Soul training. |
| Authoritative identity source | EXECUTED / AUTHORITATIVE | SRC-SAGE-001 through SRC-SAGE-013 collectively control identity and proportions; all thirteen were accepted unchanged. |
| Soul diagnostic | APPROVED FOR KEYFRAME DEVELOPMENT | Seven private outputs reviewed against all originals; DIAG-04 rejected for invented tattoos; face length and eye narrowing remain frame-level constraints. |
| Keyframe anchors | COMPLETE / SELECTED | Twelve anchors selected: six corrected, four deterministic transition boundaries, and KF-06 desktop v4/mobile v5. |
| Motion segments | COMPLETE / APPROVED FOR ASSEMBLY | Eight successful silent 1080p segments; one failed attempt refunded and replaced once. |
| Private OpenAI reference submission | COMPLETE FOR BATCH 001 ONLY | The same five metadata-stripped face references were used in three authorized submissions; no public output upload occurred. |
| Higgsfield upload / Soul creation | COMPLETE | Thirteen unchanged originals accepted once; one private Soul Cinematic model completed. |
| Paid-credit generation | EXECUTED FOR APPROVED PREVIEW ASSET WORK | 25 training + 0.84 diagnostic + 42 keyframe-correction + 360 successful-motion credits = 427.84 spent; one 45-credit failed attempt was fully refunded; concurrent 10-credit reward remains recorded separately. |
| Website implementation | IN PROGRESS FOR LOCAL/PROTECTED PREVIEW | Preserve current functional contracts; production release remains gated. |
| Production deploy or domain/provider mutation | BLOCKED | Requires the formal launch gate and explicit deployment authority. |

## 5. Audience and outcome

Primary audiences are potential fashion, creator, hospitality, and destination partners evaluating Sage’s range and professionalism. Secondary audiences are talent/scouting and event-artistry prospects. The hero must establish editorial presence immediately while allowing the existing site to continue explaining services, work, and contact options.

Success means:

- Sage remains recognizably the same person across every approved frame.
- The runway and resort are spatially reproducible, not prompt-by-prompt inventions.
- The occlusion creates a credible hidden edit rather than a dissolve or teleport.
- Desktop and mobile preserve subject, copy, and CTA safe zones.
- The final frame works independently as poster and reduced-motion fallback.
- Future web delivery is deterministic, accessible, and materially lighter than runtime generation.

## 6. Experience and content architecture

The cinematic is a bounded enhancement to the existing home hero now entering protected-preview integration. It does not change public information architecture:

- /
- /about
- /services
- /portfolio
- /portfolio/[slug]
- /contact
- /links
- /privacy
- /admin/login and authenticated /admin routes
- /api/contact and authenticated /api/admin routes
- /robots.txt and /sitemap.xml

Runtime states that a later implementation must specify and test:

- Initial poster / video loading
- Scroll-controlled playback
- Completed cinematic
- Reduced motion
- Media load failure
- Data saver / constrained network fallback
- Keyboard focus on Skip cinematic
- Touch and viewport-orientation changes
- Restored page position
- JavaScript unavailable

## 7. Visual system

### Narrative contrast

| Runway | Transition | Resort |
|---|---|---|
| Near-black, graphite, cool neutral | Controlled black with a directional warm leak | Ivory, warm sand, sunlit water, restrained foliage |
| Hard architectural axes | Near-lens organic edge | Open horizon and breathable depth |
| Dormant-to-activated practicals | Coverage-to-reveal | Warm emergence-to-settled daylight |
| Focused confidence | Concealed cut | Warm confidence and invitation |

### Typography and UI

The existing Cormorant Garamond display voice, Hanken Grotesk interface voice, wordmark, buttons, focus states, and site navigation remain the baseline. Generated media must contain no typography, logo, watermark, controls, or audio. Copy and controls remain semantic HTML over or adjacent to deterministic media.

### Motion principles

- Native scroll remains the input; no scroll-jacking.
- Movement is editorial and legible, not frenetic.
- Camera axis and screen direction remain stable through the hidden cut.
- Practical-light activation follows physical fixtures.
- Hair and fabric motion support the transition without hiding identity errors.
- Reduced-motion users receive a complete static composition and equivalent CTA access.

## 8. Component and state preservation contract

Later implementation must preserve:

- Admin session authentication, rate limits, and protected route behavior.
- Deep content validation, guarded persistence fallback, and current content editor behavior.
- Contact validation, honeypot, delivery handling, and mailto fallback; automated verification must never submit production contact.
- Dynamic content loading and footer social data.
- Vercel Analytics.
- Metadata, robots, sitemap, privacy route, and indexability.
- Header navigation, mobile navigation, focus indicators, keyboard use, and touch targets.
- Next Image safety and all existing responsive routes.
- The current hero until the cinematic asset set and replacement plan are explicitly approved.

## 9. Responsive and accessibility requirements

- Desktop keyframes: 16:9 master composition with a 5% action-safe boundary and a documented copy-safe region.
- Mobile keyframes: 9:16 master composition with 8% side action-safe boundaries, top browser-chrome allowance, and CTA clearance above the lower gesture area.
- Never place critical facial detail, hands, the transition edge, or fixed environment anchors in unsafe crop zones.
- Provide a visible Skip cinematic control when motion is active.
- Respect prefers-reduced-motion without requiring interaction.
- No autoplay audio and no audio-dependent meaning.
- Poster, error, and reduced-motion states must preserve the same heading and CTA semantics.
- Playback must not trap focus, change URL history during scroll, or prevent normal document navigation.

## 10. Complete dependency plan

| Phase | Steps | Owner | Deliverables | Completion evidence | Estimate | Gate |
|---|---|---|---|---|---|---|
| 0. Reconcile | 1 | Engineering | Git/deployment/tool/source audit | Exact commits, deployment IDs, route evidence, clean isolated branch | Complete | G0 |
| 1. Govern | 2–4 | Creative engineering + owner | Private rights register, sanitized source/asset manifests, stable IDs, prompt contract, generation log | Valid JSON; no binaries or private paths in Git; authority confirmed | Complete | G1 |
| 2. Character | 5–9 | Creative lead + Sage | All-original Soul route plus a seven-output identity/proportion diagnostic | Thirteen unchanged originals accepted; one Soul and seven diagnostics completed; approved for keyframe development | Complete | G2–G3 |
| 3. Worlds | 10–11 | Art direction | Runway/resort geometry, materials, camera, lighting, transition systems | Approved empty plates, anchor maps, and continuity sheets | 2–3 review cycles each | G3 |
| 4. Keyframes | 12–15 | Art direction + Sage | 6 desktop + 6 mobile keyframes | All review checks pass; selected versions marked APPROVED | 2–5 review cycles | G4 |
| 5. Motion feasibility | 16–18 | Motion lead | Four low-cost Architecture B segments and defect log | Cost preflight, reproducible settings, continuity findings | 1–3 test rounds | G5 |
| 6. Final media | 19–21 | Motion/editorial | Clean silent masters, WebM/MP4 variants, posters | Frame-accurate QC, optimized media budget, provenance log | 2–4 days after approval | G5 |
| 7. Web implementation | 22–23 | Engineering | Isolated cinematic implementation and verification | Build/tests plus desktop/mobile/accessibility/performance evidence | 2–4 days | G6 |
| 8. Release | 24–25 | Owner + launch operator | Formal launch-gate record and immutable deployment | Explicit deploy approval and live artifact verification | Separate release window | G7 |

Detailed sequence:

1. Verify repository, GitHub, Vercel, browser behavior, tools, and source materials. COMPLETE for this checkpoint.
2. Inventory references, claims, duplicates, brand marks, gaps, rights, consent, and privacy. COMPLETE for the supplied batch; workflow authority confirmed.
3. Verify and execute the Higgsfield Soul route. COMPLETE: all thirteen unchanged originals accepted, one `--soul-cinematic` model completed, and training spent 25 credits.
4. Establish private folders, stable IDs, manifests, prompt specifications, and append-only generation logging. COMPLETE for Batch 001.
5. Treat all thirteen original photographs collectively as the authoritative identity/proportion set; preserve the available angle, expression, hairstyle, pose, session, and body variation. COMPLETE AND EXECUTED.
6. Draft the first source-linked face-identity prompt batch. COMPLETE.
7. Generate the owner-authorized three-candidate private OpenAI batch. COMPLETE as historical comparison evidence.
8. Record owner preference without promoting synthetic evidence. COMPLETE: attempt 003 is the preferred comparison; attempt 002 is not the preferred baseline; no generated candidate may feed Soul training.
9. Train exactly one Soul from SRC-SAGE-001 through SRC-SAGE-013 as unchanged originals, generate seven diagnostic views, and review against all originals. COMPLETE — `APPROVED FOR KEYFRAME DEVELOPMENT`.
10. Produce runway geometry, material, camera, light, and transition systems.
11. Produce resort geometry, material, camera, and light systems.
12. Finalize six desktop prompt specifications.
13. Finalize six separately composed mobile prompt specifications.
14. Generate low-cost candidates in logged batches after approval.
15. Refine selected keyframes; never overwrite failed or superseded versions.
16. Preflight and test four Architecture B segments at minimum useful cost.
17. Diagnose identity, motion, geometry, lighting, transition, and temporal defects.
18. Iterate with explicit prompt/settings deltas.
19. Generate only approved high-quality silent segments.
20. Stitch, retime, stabilize, composite, grade, and clean offline.
21. Export optimized desktop/mobile media and posters.
22. Implement in a new isolated code branch after explicit authorization.
23. Verify routes, forms, admin, analytics, accessibility, performance, and responsive behavior.
24. Run production-launch-gate.
25. Deploy only with explicit authority and verify the immutable production artifact.

## 11. Approval gates

| Gate | Required approval/evidence | Stops |
|---|---|---|
| G0 — trustworthy baseline | Canonical Git, provider artifact, live behavior, and dirty check reconciled | Any code or asset work on an uncertain base |
| G1 — source intake | Readable private batch, hash inventory, duplicates/brands/quality classified, stable IDs, private ledger | COMPLETE for supplied media; workflow authority confirmed |
| G2 — likeness and rights | Complete likeness, source, commercial, upload, and publication authority | PASSED |
| G3 — provider and spend | One private Soul and seven diagnostics reviewed against originals | PASSED — 13 accepted inputs, one completed Soul, seven completed diagnostics, 25.84 gross credits |
| G4 — keyframe selection | Sage/owner approves exact desktop/mobile versions and intended use | Motion tests and downstream interpolation |
| G5 — final media | Owner approves motion, grade, identity, and web exports | Web integration |
| G6 — implementation | Explicit authority to change code; preservation test plan accepted | Source-code changes |
| G7 — launch | production-launch-gate passes and deployment authority is explicit | Production release/provider mutation |

## 12. Current execution state

The all-original Soul and diagnostic gate is complete. Candidate 003 remains comparison-only and cannot override the thirteen originals. The current decision is `APPROVED FOR KEYFRAME DEVELOPMENT`. Keyframe, video, and site-preview execution is authorized with mandatory rejection of face lengthening, eye narrowing, invented tattoos, and any source-identity drift. Production deployment and merge remain unperformed pending the formal launch gate.

## 13. Implementation acceptance criteria

No future code batch is acceptable unless it:

- Starts from a clean, current branch and scopes changes to the cinematic.
- Uses only approved, optimized assets with recorded provenance.
- Preserves all behaviors in section 8.
- Passes focused tests, lint, type checking, and production build.
- Receives real desktop and mobile browser verification across every affected state.
- Includes media weight and loading evidence, reduced-motion verification, and no horizontal overflow.
- Rechecks Git status and exact diff before any commit.
- Uses production-launch-gate before any release.

## 14. Plain-language summary

The first synthetic diagnostic remains useful history, and the user prefers attempt 003 over attempt 002, but no generated candidate is authoritative or eligible for Soul training. All thirteen original photographs—not crops or normalized derivatives—were accepted unchanged into one completed Soul Cinematic run. Seven private diagnostics were reviewed against the originals, producing `APPROVED FOR KEYFRAME DEVELOPMENT` with strict frame-level drift constraints. Keyframe, video, and site-preview work may continue; production release remains gated.
