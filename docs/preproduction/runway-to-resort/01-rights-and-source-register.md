# Rights and Source Register

Last verified: 2026-07-16

Policy: Private diagnostic generation requires explicit subject/owner authority, a bounded provider scope, and source-level intake evidence. It does not establish photographer copyright, client/agency approval, trademark permission, commercial derivative rights, publication approval, or production authority.

## Classification vocabulary

- CONFIRMED — file exists and its technical identity was verified.
- RECEIVED — file is readable but technical review is incomplete.
- HASHED — original file is readable, privately fingerprinted, and mapped to a stable source ID.
- DUPLICATE — byte-identical to another confirmed file.
- UNSUITABLE — accessible but cannot establish Sage identity or the requested visual control.
- RIGHTS_UNKNOWN — technical source exists but required ownership, license, consent, or downstream-use evidence is absent.
- MISSING — described historically but not accessible in the current workspace or attachment store.
- APPROVED_SOURCE — rights/consent evidence has been reviewed for the exact proposed use. No current source has this state for commercial publication.

## Current register

| Source ID | Intake / duplicate | Sanitized roles | First identity batch | Rights / brand state | Decision |
|---|---|---|---|---|---|
| SRC-SAGE-001 | HASHED / unique | Face, near-front, hair | SELECTED | Copyright/license UNKNOWN; no visible brand | Primary facial anchor |
| SRC-SAGE-002 | HASHED / unique | Hair, posed full body | REJECTED | Copyright/license UNKNOWN; no visible brand | Face too small; severe pose foreshortening |
| SRC-SAGE-003 | HASHED / unique | Posed full body, expression, hair | REJECTED | Copyright/license UNKNOWN; no visible brand | Face too small and non-neutral; not gait evidence |
| SRC-SAGE-004 | HASHED / unique | Face, three-quarter, hair | SELECTED | Copyright/license UNKNOWN; no visible brand | Best available opposing-angle evidence; head-tilt/retouch caveat |
| SRC-SAGE-005 | HASHED / unique | Near-front face, hairline | SELECTED | Copyright/license UNKNOWN; no visible brand | Strongest near-frontal evidence; one cheek obstructed |
| SRC-SAGE-006 | HASHED / unique | Face, three-quarter, hair | SELECTED AS FACE CROP | Copyright/license UNKNOWN; source brand present and excluded | Jaw/ear evidence; branded lower frame not submitted |
| SRC-SAGE-007 | HASHED / unique | Face, expression | REJECTED | Copyright/license UNKNOWN; unidentified product context | Non-neutral expression and cheek/jaw obstruction |
| SRC-SAGE-008 | HASHED / unique | Hair motion, full body, runway aesthetic | REJECTED | Copyright/license UNKNOWN; no clear brand | Reserve for later hair/motion review; not neutral face evidence |
| SRC-SAGE-009 | HASHED / unique | Face, three-quarter, runway aesthetic | REJECTED | Copyright/license UNKNOWN; source brand present | Redundant with stronger selected angle; branded full frame |
| SRC-SAGE-010 | HASHED / unique | Posed full body, runway aesthetic | REJECTED | Copyright/license UNKNOWN; brand cue present | Face too small, severe foreshortening, not gait evidence |
| SRC-SAGE-011 | HASHED / unique | Full body, wardrobe, runway aesthetic | REJECTED | Copyright/license UNKNOWN; multiple source brands present | Face obscured; do not reproduce styling or marks |
| SRC-SAGE-012 | HASHED / unique | Full body, near-front context | REJECTED | Copyright/license UNKNOWN; multiple source brands present | Face too small for identity master; retain for later body context only |
| SRC-SAGE-013 | HASHED / unique | Near-front face, hair, partial body | SELECTED AS FACE CROP | Copyright/license UNKNOWN; source brand present and excluded | Cross-session identity check; branded lower frame not submitted |
| SRC-SAGE-014 | UNSUITABLE / unique | Media-kit context only | REJECTED | AI-generated promotional composite; claims and brand permissions UNKNOWN | Not independent photographic identity evidence |

Intake summary: fourteen source-media files were readable and privately inventoried: thirteen photographs and one media-kit artifact. Exact-byte duplicates: zero. Perceptual near-duplicate candidates at the screening threshold: zero. The owner-supplied consent digest matched the local consent record; the record, digest, filenames, paths, source hashes, EXIF, geolocation, and private ledger remain outside Git.

## Rights and uncertainty summary

- Sage likeness consent and the owner instruction authorize this private OpenAI identity-reference phase.
- Photographer/source identity, copyright ownership, source license, client approval, agency permission, trademark permission, and commercial derivative rights remain UNKNOWN for every supplied item unless later evidence resolves them.
- A visible-brand source may contribute only a private face crop that excludes the marked region. No source brand, trade dress, social-platform mark, media-kit text, claim, or campaign styling may be reproduced.
- SRC-SAGE-014 carries trained-algorithmic-media provenance and uncorroborated promotional claims. It is context only, not verified identity evidence.
- No source or output is approved for publication or commercial website use at this checkpoint.

## Exact missing-photo request

The first diagnostic batch may proceed, but generated profiles are inferred proposals. The cleanest follow-up is one same-session five-shot shoulder-up set:

1. true front;
2. 45 degrees with the nose toward frame-left;
3. 45 degrees with the nose toward frame-right;
4. 90-degree profile with the nose toward frame-left;
5. 90-degree profile with the nose toward frame-right.

Use eye-height camera placement, approximately 85–105 mm full-frame-equivalent perspective, diffuse neutral light, identical distance/crop/exposure, closed-mouth neutral expression, hair behind both ears, and no eyewear, jewelry, logos, beauty filters, portrait-mode reshaping, or material retouching. This batch also lacks neutral side/rear body views and a genuine gait sequence, but those are intentionally outside the current identity checkpoint.

## Intake procedure

1. Keep the archive outside normal Git history in a private, access-controlled location.
2. Privately record original filename, size, MIME type, dimensions, embedded-metadata review, and SHA-256 before any conversion; do not copy EXIF values or private absolute paths into Git.
3. Detect byte duplicates and visually near-duplicate crops/edits.
4. Assign SRC-SAGE-### only after technical identity is stable.
5. Evaluate each image for face view, body view, expression, hair, gait, lighting neutrality, lens distortion, retouching, obstruction, brand marks, and generative suitability.
6. Link every source to rights-ledger evidence.
7. Mark a source APPROVED_SOURCE only for the exact approved downstream use.
8. Derivatives receive new IDs and hashes; never overwrite originals.
9. Do not place source photographs, reusable identity models, or full-resolution generated assets in normal Git history.

## Storage decision

| Option | Current decision | Reason |
|---|---|---|
| Private local controlled folder | ACTIVE | Contains private intake, working crops, generated candidates, and comparison evidence outside Git |
| Normal Git | Prohibited for raw/large/private assets | Repository history is durable and may be shared |
| Git LFS | Evaluate only after repo privacy and retention review | LFS does not by itself create privacy or deletion guarantees |
| Vercel Blob | Not authorized | Production data mutation and provider upload require explicit approval |
| OpenAI Image Creator | Authorized for this first private identity batch only | Maximum three diagnostic candidates from the five selected face references |
| Higgsfield account storage | Not authorized operationally | Consent exists, but authentication, upload, Soul creation, model/cost preflight, and credits remain later gates |
| Public delivery path | Approved optimized outputs only, later | Requires exact asset approval and implementation authority |

## Rights gate checklist

For the current private OpenAI diagnostic, the named provider, operation, source subset, privacy boundary, and maximum candidate count are explicitly authorized. Before any Higgsfield operation, commercial publication, or production use, every unresolved answer below must be YES:

- Does Sage explicitly authorize the named provider and intended operation?
- Does each affected source/output have sufficient photographer/copyright permission for the exact later use?
- Are commercial website and AI-reference uses covered separately?
- Are campaign/client restrictions and visible trademarks resolved?
- Has the owner accepted the provider’s current retention, training, and marketing terms?
- Is access scoped to an authorized private account?
- Is the exact later provider/model cost known and approved before any paid credit use?
- Is deletion/retention handling documented?
- Is the output still treated as PROPOSED pending Sage review?

Current result: G1 technical intake complete; Sage likeness consent confirmed; narrow private OpenAI diagnostic authorized; third-party source rights and all commercial/public uses remain blocked. Stop after the first identity-review checkpoint.
