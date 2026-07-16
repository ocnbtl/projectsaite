# Rights and Source Register

Last verified: 2026-07-16

Policy: Complete likeness, photographer, copyright, commercial-use, provider-upload, and publication authority is owner-confirmed for the Project Saite workflow. Private source files and operational provider metadata remain outside Git.

## Classification vocabulary

- CONFIRMED — file exists and its technical identity was verified.
- RECEIVED — file is readable but technical review is incomplete.
- HASHED — original file is readable, privately fingerprinted, and mapped to a stable source ID.
- DUPLICATE — byte-identical to another confirmed file.
- UNSUITABLE — accessible but cannot establish Sage identity or the requested visual control.
- RIGHTS_UNKNOWN — technical source exists but required ownership, license, consent, or downstream-use evidence is absent.
- MISSING — described historically but not accessible in the current workspace or attachment store.
- APPROVED_SOURCE — rights and consent are confirmed for the exact Project Saite workflow.

## Current register

| Source ID | Intake / duplicate | Sanitized roles | OpenAI Batch 001 history | Soul Run 001 input decision | Rights / brand state |
|---|---|---|---|---|---|
| SRC-SAGE-001 | APPROVED_SOURCE / unique | Face, near-front, hair | SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-002 | APPROVED_SOURCE / unique | Hair, posed full body | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-003 | APPROVED_SOURCE / unique | Posed full body, expression, hair | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-004 | APPROVED_SOURCE / unique | Face, three-quarter, hair | SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-005 | APPROVED_SOURCE / unique | Near-front face, hairline | SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-006 | APPROVED_SOURCE / unique | Face, three-quarter, hair, partial body | SELECTED AS FACE CROP | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-007 | APPROVED_SOURCE / unique | Face, expression | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-008 | APPROVED_SOURCE / unique | Hair motion, full body, runway aesthetic | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed |
| SRC-SAGE-009 | APPROVED_SOURCE / unique | Face, three-quarter, runway aesthetic | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-010 | APPROVED_SOURCE / unique | Posed full body, runway aesthetic | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-011 | APPROVED_SOURCE / unique | Full body, wardrobe, runway aesthetic | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-012 | APPROVED_SOURCE / unique | Full body, near-front context | NOT SELECTED | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-013 | APPROVED_SOURCE / unique | Near-front face, hair, partial body | SELECTED AS FACE CROP | SUBMITTED ORIGINAL UNCHANGED / ACCEPTED | Complete workflow authority confirmed; source branding accepted as input context |
| SRC-SAGE-014 | UNSUITABLE / unique | AI-generated media-kit context only | EXCLUDED | EXCLUDED | Generated composite; claims, source, and brand permissions UNKNOWN |

Intake summary: fourteen source-media files were readable and privately inventoried: thirteen photographs and one media-kit artifact. Exact-byte duplicates: zero. Perceptual near-duplicate candidates at the screening threshold: zero. The owner-supplied consent digest matched the local consent record; the record, digest, filenames, paths, source hashes, EXIF, geolocation, and private ledger remain outside Git.

## Rights and uncertainty summary

- Complete likeness, photographer, copyright, commercial-use, provider-upload, and publication authority is confirmed for the Project Saite workflow.
- All thirteen original photographs collectively remain the authoritative identity and proportion set. Each was submitted directly in its original state; no crop, background removal, retouch, recolor, upscale, reshape, normalization, or synthetic filler was used.
- Visible branding was accepted as incidental context in the unchanged private training inputs. Generated runway/resort outputs must still avoid unintended logos, copied marks, recognizable trade dress, media-kit text, and campaign styling.
- SRC-SAGE-014 carries trained-algorithmic-media provenance and uncorroborated promotional claims. It is context only, not verified identity evidence.
- Candidates 001 through 003 and every other generated derivative are excluded from Soul training. Candidate 003 is a user-preferred comparison clue only; it cannot override discrepancies against the originals.
- One private Soul Cinematic run completed from all thirteen originals at 25 credits. Seven private Soul Cinema diagnostics completed at 0.84 gross credits; a separate concurrent 10-credit provider reward is recorded without storing an account balance.
- Diagnostic decision: `APPROVED FOR KEYFRAME DEVELOPMENT`. Production deployment and merge remain unperformed pending the release gate.

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
| Higgsfield account storage | ONE PRIVATE `--soul-cinematic` RUN COMPLETE | Thirteen unchanged originals accepted; one Soul completed; seven private diagnostics completed; private provider identifiers stay outside Git |
| Public delivery path | Approved optimized outputs only, later | Requires exact asset approval and implementation authority |

## Executed gate result

All thirteen authoritative originals were submitted once, unchanged, with zero exact duplicates; all were accepted. One private Soul Cinematic run completed, followed by seven private Soul Cinema diagnostics. The original photographs remain authoritative, Candidate 003 remains comparison-only, SRC-SAGE-014 remains excluded, and generated candidates remain excluded from training. The diagnostic gate approved controlled keyframe development with three standing frame-level constraints: do not lengthen the face, do not narrow the eyes, and do not invent tattoos. Keyframe, video, and site-preview execution is authorized; production deployment and merge remain separate release-gate actions.
