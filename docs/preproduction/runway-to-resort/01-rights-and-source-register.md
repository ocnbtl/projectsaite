# Rights and Source Register

Last verified: 2026-07-15

Policy: No identity inference, external upload, likeness training, generation, publication, or commercial use without source-level evidence and the applicable approval gate.

## Classification vocabulary

- CONFIRMED — file exists and its technical identity was verified.
- DUPLICATE — byte-identical to another confirmed file.
- UNSUITABLE — accessible but cannot establish Sage identity or the requested visual control.
- RIGHTS_UNKNOWN — technical source exists but required ownership, license, consent, or downstream-use evidence is absent.
- MISSING — described historically but not accessible in the current workspace or attachment store.
- APPROVED_SOURCE — rights/consent evidence has been reviewed for the exact proposed use. No current asset has this state.

## Current register

| Register ID | Class | Non-sensitive evidence | Suitability | Rights / privacy state | Action |
|---|---|---|---|---|---|
| DOC-CINEMATIC-001 | CONFIRMED | Current owner-approved direction packet was reviewed locally | Direction and constraints only | User-supplied project evidence | Keep as dated instruction; do not treat as visual source |
| DOC-SNAPSHOT-HISTORICAL | DUPLICATE | Duplicate historical project documentation was identified locally | Historical evidence only | No image rights evidence | Do not duplicate or publish private fingerprints |
| DOC-BRIEF-001 | CONFIRMED | Original project brief was reviewed locally | Business/design context | No image rights evidence | Treat claims as dated until owner confirms |
| BRAND-WORDMARK-CANDIDATES | RIGHTS_UNKNOWN | Candidate wordmark exports exist outside Git | Brand review only; not identity input | Creator, font, and export rights require confirmation | Keep binaries and fingerprints in private intake storage |
| DOC-PROPOSAL-CANDIDATES | UNSUITABLE | Proposal/media-kit-context documents exist outside Git | Context only; not identity masters | Author, claim, and reuse status require confirmation | Keep documents and fingerprints private; reverify claims |
| WEB-PLACEHOLDERS-001 | UNSUITABLE | Current application source uses third-party placeholder photography | Explicit placeholders; not Sage | Third-party availability is not likeness consent | Never use for Sage identity |
| SRC-SAGE-HISTORICAL | MISSING | Historical notes indicate a prior photo set, but no source binary is currently available | Unknown until originals are reattached | No private technical or rights ledger is available | Request complete original set |
| MEDIA-KIT-SAGE | MISSING | No separate current media kit found | Could provide approved claims and provenance | Unknown | Request latest complete original |

No Sage photo, PDF, SVG, screenshot, or archive binary exists in the current attachment store. No present item is APPROVED_SOURCE.

## Historical sources must be reidentified privately

Historical notes described potentially useful face, expression, full-body, gait, and hair coverage, plus possible visible third-party branding. Those descriptions are not source evidence and are intentionally not retained in this Git branch. Reidentify the actual files inside private intake storage, record technical fingerprints only in the private ledger, and keep permanent hero wardrobe unbranded unless explicit brand-use rights are documented.

## Exact single-batch attachment request

Please attach one archive named Sage_Preproduction_Source_Batch.zip containing:

### 01-original-photos/

- The complete previously supplied set, preserving original filenames and the known duplicate.
- Original-resolution JPEG, HEIC, TIFF, or PNG files—not screenshots or recompressed social downloads.
- If available, add eight to ten unbranded supplemental originals covering:
  - neutral straight-on headshot;
  - left and right three-quarter headshots;
  - left and right profile headshots;
  - natural-smile headshot;
  - full-body front, side, and rear views;
  - natural walking/full-body frame.
- Overlap is allowed when one original provides multiple useful views. Do not manufacture new files merely to reach a count.

### 02-media-kit/

- Latest complete Sage media kit or pitch deck.
- Editable/source export, if available.

### 03-rights/

Include rights-ledger.csv with one row per image:

filename, photographer_or_source, shoot_or_campaign, copyright_owner, website_use_permission, ai_reference_permission, commercial_use_permission, visible_third_party_brands, restrictions, approval_date, evidence_location

Also include any available photographer licenses, model releases, campaign restrictions, or written approvals.

### 04-consent/

Include a dated note from Sage stating whether the supplied photographs may be used as private AI-assisted preproduction references and eventual approved website imagery. The note should distinguish:

- local private review;
- upload to a named external provider;
- reusable identity model / Soul creation;
- generated image and video creation;
- commercial website publication;
- provider retention/training/marketing terms;
- deletion or retention constraints.

This archive request does not itself authorize training, external upload, paid generation, publication, or deployment.

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
| Private local controlled folder | Preferred for intake | No external disclosure; easy hashing and duplicate review |
| Normal Git | Prohibited for raw/large/private assets | Repository history is durable and may be shared |
| Git LFS | Evaluate only after repo privacy and retention review | LFS does not by itself create privacy or deletion guarantees |
| Vercel Blob | Not authorized | Production data mutation and provider upload require explicit approval |
| Higgsfield account storage | Not authorized | Provider terms, retention/training exposure, account auth, and likeness consent require G2–G3 |
| Public delivery path | Approved optimized outputs only, later | Requires exact asset approval and implementation authority |

## Rights gate checklist

Before any external upload or likeness generation, every answer must be YES:

- Does Sage explicitly authorize the named provider and intended operation?
- Does each source have sufficient photographer/copyright permission?
- Are commercial website and AI-reference uses covered separately?
- Are campaign/client restrictions and visible trademarks resolved?
- Has the owner accepted the provider’s current retention, training, and marketing terms?
- Is access scoped to an authorized private account?
- Is exact generation cost known and approved?
- Is deletion/retention handling documented?
- Is the output still treated as PROPOSED pending Sage review?

Current result: BLOCKED at source intake and rights/consent evidence.
