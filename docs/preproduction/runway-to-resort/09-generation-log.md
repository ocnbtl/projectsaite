# Generation Log Protocol

Current generation count: 0

Current provider jobs: 0

Current credits spent: 0

Current uploads: 0

Current approved generated assets: 0

No generation is authorized in this phase. The empty machine-readable log at manifests/generations.json is intentional evidence, not missing work.

## Append-only rule

Each submitted provider job creates one immutable attempt record. Failure, cancellation, rejection, or unusable output still receives a record. Corrections create a new attempt with supersedes/supersededBy links; they never rewrite history.

## Required attempt fields

- attemptId and assetId/version;
- parentAttemptId or supersedes when applicable;
- submittedAt, completedAt, operator, and authorized account alias;
- provider, model, workflow, providerJobId;
- input asset IDs and SHA-256 hashes;
- prompt spec path, resolved prompt, prompt hash;
- settings, requested dimensions/aspect/duration/frame rate, and seed when supported;
- cost estimate, approval evidence, actual credits;
- output controlled URI and SHA-256;
- reviewState and reviewer;
- identity/continuity/geometry/light/motion/rights assessments;
- known defects and failure category;
- prompt/settings delta and hypothesis;
- intended downstream use;
- retention/deletion state.

Do not record tokens, passwords, OAuth secrets, private consent documents, or public links to private source/output files.

## Failure taxonomy

- IDENTITY_FACE
- IDENTITY_BODY
- APPARENT_AGE
- SKIN_TONE_OR_GRADE
- HAIR_CONTINUITY
- HANDS_FEET_TEETH
- GAIT_OR_FOOT_SLIDE
- WARDROBE_CONSTRUCTION
- BRAND_TEXT_WATERMARK
- CAMERA_OR_LENS
- GEOMETRY_OR_ANCHOR
- LIGHT_SHADOW_REFLECTION
- OCCLUSION_COVERAGE
- TEMPORAL_FLICKER
- START_END_NONCONVERGENCE
- PROVIDER_REJECTION
- COST_OR_QUOTA
- RIGHTS_OR_CONSENT
- TECHNICAL_OUTPUT

## First authorized experiment template

The first possible job is one low-resolution/minimum-useful-cost CHR-SAGE-FACE-001 candidate batch or, if identity anchors have already been separately approved, VID-RWY-D-001. Before submission:

1. Resolve G1 source intake.
2. Resolve G2 likeness/rights.
3. Resolve G3 named provider/account/privacy/cost/spend.
4. Record exact approved input hashes.
5. Run official read-only cost preflight.
6. Obtain explicit approval for the displayed amount and job count.
7. Submit only the approved job scope.
8. Export and hash outputs promptly under the approved retention plan.

## Human review record

Approval evidence must identify the exact file hash/version and the approved downstream use. “Looks good” without asset/version identity is not durable approval. A generation log entry may be REVIEWED while the asset manifest remains PROPOSED; the manifest becomes APPROVED only after the designated reviewer accepts the exact version.
