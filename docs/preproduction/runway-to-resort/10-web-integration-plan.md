# Future Web Integration Plan

Status: NOT AUTHORIZED FOR IMPLEMENTATION. This document defines a later engineering contract; no application file is changed in the current preproduction batch.

## Current implementation surface

- Next.js App Router homepage is a force-dynamic Server Component.
- Vercel Blob-backed getSiteContent() supplies the current hero and owner-editable site content.
- Current hero is a responsive split-grid next/image composition.
- Existing motion is limited to lightweight reveal/header behavior.
- prefers-reduced-motion CSS already exists.
- No GSAP, Framer Motion, video sequence model, or public asset directory is currently present.

The cinematic should enter through a narrow client-component boundary while content retrieval remains server-side.

## Proposed component boundary

Future names are illustrative:

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

## Performance budget to approve before implementation

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

1. Approve final media assets and rights.
2. Create a new isolated implementation branch/worktree from current reconciled base.
3. Add a static poster/fallback contract first.
4. Add media source selection/loading/error handling.
5. Add scroll mapping and Skip/reduced-motion states.
6. Extend validated content/admin behavior only if the owner needs media editing.
7. Run focused and broad validation plus browser QA.
8. Review exact diff and media weights.
9. Commit/push only after applicable checks and authorization.
10. Run production-launch-gate before any production action.
11. Deploy only after explicit approval; verify immutable deployment and live aliases.

## Production/provider boundaries

This plan does not authorize:

- attaching sageburress.com to Vercel or changing DNS/certificates;
- Vercel environment changes;
- production Blob writes;
- Resend/Workspace configuration or email sends;
- public release or production deployment;
- replacement/removal of the current hero.
