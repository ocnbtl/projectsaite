# Rights and Source Register

Last verified: 2026-07-16

Policy: Private identity processing requires explicit subject/owner authority, a bounded provider scope, source-level intake evidence, and a provider-compatible input license. Subject consent and owner instruction do not establish photographer copyright, client/agency approval, trademark permission, commercial derivative rights, publication approval, or production authority.

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

| Source ID | Intake / duplicate | Sanitized roles | OpenAI Batch 001 history | Soul Run 001 input decision | Rights / brand state |
|---|---|---|---|---|---|
| SRC-SAGE-001 | HASHED / unique | Face, near-front, hair | SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no visible brand |
| SRC-SAGE-002 | HASHED / unique | Hair, posed full body | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no visible brand |
| SRC-SAGE-003 | HASHED / unique | Posed full body, expression, hair | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no visible brand |
| SRC-SAGE-004 | HASHED / unique | Face, three-quarter, hair | SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no visible brand |
| SRC-SAGE-005 | HASHED / unique | Near-front face, hairline | SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no visible brand |
| SRC-SAGE-006 | HASHED / unique | Face, three-quarter, hair, partial body | SELECTED AS FACE CROP | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; source brand allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-007 | HASHED / unique | Face, expression | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; product/brand context present |
| SRC-SAGE-008 | HASHED / unique | Hair motion, full body, runway aesthetic | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; no clear brand |
| SRC-SAGE-009 | HASHED / unique | Face, three-quarter, runway aesthetic | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; source brand allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-010 | HASHED / unique | Posed full body, runway aesthetic | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; brand cue allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-011 | HASHED / unique | Full body, wardrobe, runway aesthetic | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; source brands allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-012 | HASHED / unique | Full body, near-front context | NOT SELECTED | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; source brands allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-013 | HASHED / unique | Near-front face, hair, partial body | SELECTED AS FACE CROP | SELECTED ORIGINAL UNCHANGED / NOT UPLOADED | Copyright/license UNKNOWN; source brand allowed by owner/project input policy; provider acceptance unverified |
| SRC-SAGE-014 | UNSUITABLE / unique | AI-generated media-kit context only | EXCLUDED | EXCLUDED | Generated composite; claims, source, and brand permissions UNKNOWN |

Intake summary: fourteen source-media files were readable and privately inventoried: thirteen photographs and one media-kit artifact. Exact-byte duplicates: zero. Perceptual near-duplicate candidates at the screening threshold: zero. The owner-supplied consent digest matched the local consent record; the record, digest, filenames, paths, source hashes, EXIF, geolocation, and private ledger remain outside Git.

## Rights and uncertainty summary

- Sage likeness consent and the owner instruction authorize the completed private OpenAI diagnostic and the bounded first Higgsfield Soul attempt.
- Photographer/source identity, copyright ownership, source license, client approval, agency permission, trademark permission, and commercial derivative rights remain UNKNOWN for every supplied item unless later evidence resolves them.
- All thirteen original photographs collectively are the authoritative identity and proportion set. If the provider gate is cleared, each must be uploaded directly in its original state; no crop, background removal, retouch, recolor, upscale, reshape, normalization, or synthetic filler is permitted.
- Owner/project policy permits visible branding as incidental context in the intended unchanged private training input and does not use it as an exclusion reason. Provider acceptance remains unverified and the provider may filter or reject branded inputs. This policy does not grant trademark or reproduction rights. Generated diagnostics and later runway/resort outputs must avoid unintended logos, copied marks, recognizable trade dress, media-kit text, and campaign styling.
- SRC-SAGE-014 carries trained-algorithmic-media provenance and uncorroborated promotional claims. It is context only, not verified identity evidence.
- Candidates 001 through 003 and every other generated derivative are excluded from Soul training. Candidate 003 is a user-preferred comparison clue only; it cannot override discrepancies against the originals.
- No source or output is approved for publication or commercial website use at this checkpoint.
- No Higgsfield file upload, Soul creation, diagnostic generation, or credit spend occurred.

## Conditional additional-photo request

Additional photography is not needed to meet current published operational requirements. Official Soul skill v0.12.0 accepts 5–20 photos with a 5+ unique-face threshold, and the official guide gives 8–12 as a sweet spot. All thirteen originals are qualifying JPEG files at 2001 x 3000 or larger. Additional photography becomes relevant only if the eventual diagnostic returns `RETRAIN WITH ALL ORIGINALS PLUS ADDITIONAL REAL PHOTOS` or `NEEDS CONTROLLED FULL-BODY OR PROFILE CAPTURE`. The smallest useful same-session shoulder-up set is:

1. true front;
2. 45 degrees with the nose toward frame-left;
3. 45 degrees with the nose toward frame-right;
4. 90-degree profile with the nose toward frame-left;
5. 90-degree profile with the nose toward frame-right.

Use eye-height camera placement, approximately 85–105 mm full-frame-equivalent perspective, diffuse neutral light, identical distance/crop/exposure, closed-mouth neutral expression, hair behind both ears, and no eyewear, jewelry, logos, beauty filters, portrait-mode reshaping, or material retouching. Never duplicate or transform existing files to manufacture additional evidence.

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
| OpenAI Image Creator | Batch 001 complete | Three private diagnostic candidates from five selected face references; none is authoritative or eligible for Soul input |
| Higgsfield account storage | ONE `--soul-cinematic` RUN AUTHORIZED / BLOCKED BEFORE UPLOAD | All thirteen unchanged originals satisfy the published 5–20 count, JPEG format, and ideal-resolution guidance; unknown photographer/source rights conflict with the provider input-license grant, and the authenticated UI needed to confirm exact file acceptance, paid Basic+ plan eligibility, balance/final charge, and explicit private visibility/terms was unavailable |
| Public delivery path | Approved optimized outputs only, later | Requires exact asset approval and implementation authority |

## Rights gate checklist

The owner has authorized one bounded Higgsfield Soul run and a seven-output diagnostic, but execution cannot proceed merely from subject consent. Before upload, the following operational questions must be resolved:

- Does each affected source have sufficient photographer/source permission to support Higgsfield's required upload and processing license?
- Are commercial website and AI-reference uses covered separately?
- Are campaign/client restrictions and visible trademarks resolved?
- Has the owner accepted the provider’s current retention, training, and marketing terms?
- Is access scoped to an authorized private account?
- Does the authenticated interface confirm that all thirteen originals are accepted without transformation and expose explicit private visibility/terms? The operational variant is already selected as `--soul-cinematic`.
- Does the authenticated interface confirm paid Basic+ plan eligibility, the exact signed-in one-run charge, and a sufficient existing credit balance?
- Is deletion/retention handling documented?
- Is the output still treated as PROPOSED pending Sage review?

Current result: all thirteen originals are selected unchanged as the authoritative set, and one Soul plus seven diagnostics is bounded and owner-authorized. Execution is BLOCKED before upload by UNKNOWN photographer/source rights, the provider license/biometric-processing conflict, and unavailable authenticated account preflight. Totals remain zero Higgsfield uploads, zero Souls, zero diagnostics, and zero recorded Higgsfield credits. Commercial/public use remains blocked.
