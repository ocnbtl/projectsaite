# Web Integration Plan and Execution State

Status: IN IMPLEMENTATION FOR LOCAL AND PROTECTED NONPRODUCTION PREVIEW. The static poster path is accepted, eight motion segments passed review, and the desktop/mobile delivery derivatives are complete and verified. Production deployment and merge remain pending the formal release gate.

## Current implementation surface

- Next.js App Router homepage is a force-dynamic Server Component.
- Vercel Blob-backed getSiteContent() supplies the current hero and owner-editable site content.
- The prior responsive split-grid hero remains the semantic/content fallback contract.
- Existing motion is limited to lightweight reveal/header behavior.
- prefers-reduced-motion CSS already exists.
- Runtime motion remains pre-rendered and silent; no runtime AI generation is introduced.

The cinematic should enter through a narrow client-component boundary while content retrieval remains server-side.

## Authorized component boundary

The implementation should use this boundary:

- HomePage server component continues loading SiteContent.
- CinematicHero client component receives approved media/poster metadata and current hero copy.
- useCinematicTimeline isolates scroll progress, media readiness, and reduced-motion/data-saver decisions.
- Current static hero remains a fallback component until replacement is approved and can remain the fail-safe afterward.

Do not extend the Blob content schema/admin editor merely to land an experiment. First decide whether media URLs are deploy-time configuration, validated content fields, or a versioned asset manifest exposed through a safe adapter.

## Deterministic media contract

Expected approved derivatives:

- Desktop WebM and MP4.
- Mobile WebM and MP4.
- Desktop poster.
- Mobile poster.
- Optional lightweight preload/poster derivative.
- Private archival masters outside public delivery.

Executed delivery state:

- KF-06 desktop v4 and mobile v5 are the accepted poster/reduced-motion anchor sources.
- Eight silent five-second 1080p Seedance 2.0 segments passed structural and contact-sheet review.
- Separate 20.125-second, 24 fps desktop/mobile H264/VP9 derivatives are complete; all four are under 4.3 MB.
- The delivery validator reports `DELIVERY_ASSETS_VERIFIED` across two posters and four video derivatives.
- The hidden cut receives a deterministic full-black finish during assembly.
- All current motion delivery is protected-preview-only.

Every public derivative must link to an approved source asset/version and include dimensions, duration, frame rate, codec, byte size, SHA-256, rights scope, and approval evidence.

Runtime AI generation is prohibited. Playback uses pre-rendered media only.

## Playback model

Preferred initial spike:

- Paused HTML video as the deterministic media surface.
- Native document scroll maps a bounded hero section’s progress to video currentTime.
- Evaluate GSAP ScrollTrigger only if native requestAnimationFrame/currentTime coordination is insufficient; adding a dependency requires code review and measured value.
- Avoid frame-by-frame image sequences unless video seeking proves unacceptable at target devices and weights.
- Do not autoplay audio. Final asset is silent.
- Do not hijack wheel/touch events or lock page scroll.

## State model

| State | Behavior |
|---|---|
| server/static | Poster/static current hero and full semantic copy/CTAs |
| eligible loading | Poster visible; metadata/preload is proportionate; no blank frame |
| ready | Scroll timeline may activate; Skip cinematic appears |
| active | Native scroll controls progress; copy/CTA remain accessible |
| complete | Final frame/CTA state remains stable and normal page continues |
| reduced motion | Mobile/desktop approved static poster; no scroll-scrub animation |
| data saver / slow network | Poster or current static hero; media download deferred/avoided |
| media error | Current static hero or poster with full copy/CTA; no dead space |
| JS unavailable | Server-rendered semantic fallback |
| resize/orientation | Re-evaluate asset/composition without losing focus or trapping scroll |

## Accessibility contract

- Semantic h1, supporting copy, and CTAs remain real HTML.
- Visible keyboard-focusable Skip cinematic control during active motion.
- Skip moves directly to the stable final state without unexpected focus movement.
- prefers-reduced-motion produces equivalent content and action, not merely slower motion.
- No meaning relies on motion, color, or sound alone.
- Media is decorative where copy carries meaning; avoid verbose duplicate narration.
- Controls meet current focus, contrast, target-size, and keyboard standards.
- Normal browser scrolling, selection, zoom, history, and assistive navigation remain intact.

## Performance budget to verify before preview completion

Measure against the current production baseline, then set explicit targets. Proposed starting constraints, not promises:

- Poster is the first visual response and is aggressively optimized without visible likeness damage.
- No eager download of both desktop and mobile full video.
- Use media queries/source selection to avoid knowingly fetching the wrong master.
- Preload metadata or a proportionate first asset, not every codec/variant.
- Cinematic must not regress LCP, INP, CLS, memory, or mobile thermal behavior beyond an owner-approved budget.
- Avoid main-thread per-frame React state updates.
- Pause work when hero is out of the active range or page is hidden.

## Content and admin preservation

A later schema change must:

- preserve current hero image/alt fields as fallback;
- pass deep content validation and storage fallback behavior;
- reject malformed/unrenderable media URLs;
- handle partially configured media atomically;
- preserve current admin authorization and useful save errors;
- avoid production Blob mutation during tests;
- leave contact, social, project, service, and About editing unchanged.

## Verification matrix

Run on both desktop and mobile viewport families:

- / initial load, active scroll, end, refresh mid-page, back/forward, resize/orientation.
- reduced-motion, data-saver simulation, slow network, video failure, JS-disabled fallback where practical.
- Header/mobile menu, hero links, Skip cinematic, keyboard tab order, focus visibility.
- /about, /services, /portfolio, case study, /contact, /links, /privacy.
- /admin/login and authenticated admin shell/content flows using safe local credentials only.
- /api/admin/content unauthorized behavior.
- Contact client validation and failure fallback without production submission.
- robots/sitemap/metadata/analytics presence.
- Horizontal overflow and touch behavior.
- Production build, lint, typecheck, focused tests, and browser console/network errors.

Use separate desktop and mobile screenshots/video evidence at beginning, transition, reveal, final, reduced-motion, and failure states.

## Rollout approach

1. COMPLETE — workflow rights and the Soul identity gate are approved.
2. COMPLETE — use the current isolated implementation branch/worktree from the reconciled base.
3. COMPLETE — twelve desktop/mobile keyframe anchors selected.
4. COMPLETE — eight silent 1080p motion segments generated and reviewed.
5. COMPLETE — 20.125-second, 24 fps desktop/mobile H264/VP9 preview derivatives verified; all four are under 4.3 MB.
6. IN PROGRESS — integrate poster/media source selection, loading/error handling, scroll mapping, Skip, and reduced-motion states.
7. Extend validated content/admin behavior only if the owner needs media editing.
8. Run focused and broad validation plus browser QA.
9. Review exact diff and media weights.
10. Commit/push only after applicable checks; nonproduction preview is authorized.
11. Run production-launch-gate before any production action.
12. Deploy only after explicit approval; verify immutable deployment and live aliases.

## Production/provider boundaries

This plan does not authorize:

- attaching sageburress.com to Vercel or changing DNS/certificates;
- Vercel environment changes;
- production Blob writes;
- Resend/Workspace configuration or email sends;
- public release or production deployment;
- production replacement/removal of the current hero before the launch gate passes.
