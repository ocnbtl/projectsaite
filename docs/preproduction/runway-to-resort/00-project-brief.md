# Runway-to-Resort Preproduction Brief

Last verified: 2026-07-15 America/New_York

Primary mode: Brand / visual system

Overlay: Cinematic identity, continuity, and web-delivery preproduction

Current scope: Text-only planning and local governance artifacts

Future site implementation: Not authorized in this phase

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
| Source photographs | No Sage identity-photo binaries found in either repository or current attachment store | Identity descriptions and likeness generation are blocked. |
| Local Higgsfield integration | No Higgsfield CLI, skill, or MCP connection found | No account operation or generation can occur locally without a separate install/auth approval. |

## 3. Contradictions and unknowns

- The provider project record reports live=false while a READY target=production deployment and production aliases exist. Deployment identity, not the ambiguous live flag, is the stronger evidence.
- The custom domain is not attached to the Vercel project. Behind its expired certificate, the apex serves an older GoDaddy DPS site with a different route set; it is not evidence of current Project Saite application behavior.
- The older iCloud-backed checkout is dirty and stale. It is preserved intact and is not a source of Git truth.
- Historical notes describe a prior Sage photo set; none is accessible now. Its identity, quality, fingerprints, and rights cannot be confirmed.
- Historical guidance suggested twenty Soul ID photos. Current official Higgsfield guidance describes five to twenty varied face photos. This does not resolve whether the absent historical set is suitable or authorized.
- Current official schemas expose start and end visual anchors and unordered reference inputs, but no ordered middle-keyframe parameter. Multiple prompt beats or camera cuts are not equivalent to three temporal image anchors.
- Exact Higgsfield cost per test is account/model/settings dependent and must be preflighted inside an authorized account before spend.
- Final runtime length remains a 12–18 second, 24 fps hypothesis until low-cost motion tests and web-weight budgets are approved.

## 4. Decision ledger

| Scope | State | Evidence / boundary |
|---|---|---|
| Runway-to-Resort creative direction | APPROVED FOR PREPRODUCTION | Direct user instruction; does not approve generated assets or site replacement. |
| Six-beat narrative contract | APPROVED FOR PREPRODUCTION | KF-01 through KF-06 are required. |
| Architecture B: four start/end segments | PROPOSED, EVIDENCE-BACKED | Official schemas support start/end anchors; Architecture A lacks verified middle-anchor support. |
| Character, wardrobe, environment, and keyframe outputs | EXPLORING | Text specifications only; every generated unseen angle begins as PROPOSED. |
| External reference upload / Soul ID | BLOCKED | Requires source files, rights/consent evidence, provider authorization, and privacy decision. |
| Credit-spending generation | BLOCKED | Requires explicit spend approval after cost preflight. |
| Website implementation | BLOCKED | Requires approved assets and a later implementation authorization. |
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

The cinematic is a future enhancement to the existing home hero only. It does not change public information architecture:

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
| 1. Govern | 2–4 | Creative engineering + owner | Rights register, manifests, IDs, prompt contract, generation log | Valid JSON; no binaries; source status explicit | Complete for text-only scope | G1 |
| 2. Character | 5–9 | Creative lead + Sage | Identity, body, expression, hair, gait, wardrobe sheets | Source-linked outputs reviewed in small batches | 2–4 review cycles after inputs | G2–G3 |
| 3. Worlds | 10–11 | Art direction | Runway/resort geometry, materials, camera, lighting, transition systems | Approved empty plates, anchor maps, and continuity sheets | 2–3 review cycles each | G3 |
| 4. Keyframes | 12–15 | Art direction + Sage | 6 desktop + 6 mobile keyframes | All review checks pass; selected versions marked APPROVED | 2–5 review cycles | G4 |
| 5. Motion feasibility | 16–18 | Motion lead | Four low-cost Architecture B segments and defect log | Cost preflight, reproducible settings, continuity findings | 1–3 test rounds | G5 |
| 6. Final media | 19–21 | Motion/editorial | Clean silent masters, WebM/MP4 variants, posters | Frame-accurate QC, optimized media budget, provenance log | 2–4 days after approval | G5 |
| 7. Web implementation | 22–23 | Engineering | Isolated cinematic implementation and verification | Build/tests plus desktop/mobile/accessibility/performance evidence | 2–4 days | G6 |
| 8. Release | 24–25 | Owner + launch operator | Formal launch-gate record and immutable deployment | Explicit deploy approval and live artifact verification | Separate release window | G7 |

Detailed sequence:

1. Verify repository, GitHub, Vercel, browser behavior, tools, and source materials.
2. Inventory references, claims, duplicates, brand marks, gaps, rights, consent, and privacy.
3. Verify current Higgsfield schemas, CLI/MCP, Soul ID, prompts, pricing controls, and output terms.
4. Establish folders, stable IDs, manifests, prompt specifications, and append-only generation logging.
5. Fill identity and continuity descriptors only from approved source evidence.
6. Draft the first source-linked face-identity prompt batch.
7. Generate that batch only after G2 and G3.
8. Review identity outputs before expanding scope.
9. Produce body, expression, hair, gait, and wardrobe sheets in small reviewed batches.
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
| G1 — source intake | Complete archive, hash inventory, duplicate/brand classification | Identity description and source-linked prompts |
| G2 — likeness and rights | Sage consent; photographer/source rights; commercial and AI-reference permissions per file | Any likeness upload, training, generation, or publication |
| G3 — provider and spend | Approved provider/account, retention/privacy decision, exact cost preflight, explicit credit authority | OAuth, uploads, Soul creation, or generation |
| G4 — keyframe selection | Sage/owner approves exact desktop/mobile versions and intended use | Motion tests and downstream interpolation |
| G5 — final media | Owner approves motion, grade, identity, and web exports | Web integration |
| G6 — implementation | Explicit authority to change code; preservation test plan accepted | Source-code changes |
| G7 — launch | production-launch-gate passes and deployment authority is explicit | Production release/provider mutation |

## 12. Current blockers and exact next owner action

The independent text-only system is complete once the linked manifests, bibles, prompt library, and validation pass. The next creative action is blocked by absent Sage originals and absent per-file rights/consent evidence. The owner should supply the single archive defined in 01-rights-and-source-register.md. Attaching files does not itself authorize external upload, Soul ID, paid generation, publication, or production deployment.

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

The concept is defined, but Sage’s actual source photographs and usage permissions are not available. This system therefore locks the story, geometry, continuity, prompts, manifests, and four-segment video architecture without inventing her appearance or touching production. The next safe step is one controlled source-and-rights intake, followed by a separate decision on private provider upload and generation spend.
