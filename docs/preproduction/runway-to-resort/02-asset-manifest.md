# Asset Manifest Contract

The machine-readable records in manifests/ are the canonical preproduction index. Markdown explains policy; JSON records exact planned or produced assets.

## Stable namespaces

| Prefix | Use |
|---|---|
| SRC-SAGE-### | Original Sage references after verified intake |
| CHR-SAGE-FACE-### | Face identity sheets |
| CHR-SAGE-BODY-### | Proportion and body turnaround sheets |
| CHR-SAGE-EXPR-### | Expression sheets |
| CHR-SAGE-HAIR-### | Hair and movement sheets |
| CHR-SAGE-GAIT-### | Gait sheets |
| CHR-SAGE-SOUL-### | Private provider-trained identity model records; provider-private identifiers remain outside Git |
| CHR-SAGE-SOUL-DIAG-### | Bounded post-training identity and proportion diagnostic sets |
| WARD-RUNWAY-### | Unbranded runway wardrobe |
| WARD-RESORT-### | Unbranded resort wardrobe |
| ENV-RUNWAY-### | Runway geometry, plates, materials, and camera maps |
| ENV-RESORT-### | Resort geometry, plates, materials, and camera maps |
| LIGHT-RUNWAY-### | Runway lighting states |
| LIGHT-RESORT-### | Resort lighting states |
| TRANS-OCCLUSION-### | Occlusion and matched-light transition references |
| KF-01 through KF-06 | Narrative keyframes; composition is recorded as a variant |
| VID-RWY-### | Runway motion segments |
| VID-RST-### | Resort motion segments |
| VID-MASTER-### | Stitched masters and delivery derivatives |

IDs never encode mutable review state. Versions are positive integers, and derivatives link to parents.

Current bounded identity records:

- CHR-SAGE-SOUL-001 uses prompts/character/soul-diagnostic.md#training-contract and the selected cinematic workflow variant `--soul-cinematic`.
- CHR-SAGE-SOUL-DIAG-001 uses prompts/character/soul-diagnostic.md#diagnostic-output-contract.

Both records remain planned/blocked with zero provider output; neither identifier is a private provider Soul or job identifier.

## Required record

Each asset record contains:

- id and version;
- category and purpose;
- parentIds and sourceAssetIds;
- controlled sourceLocation or URI;
- fileHash and promptHash when a file/prompt exists;
- prompt or promptSpecPath;
- provider, model, workflow, settings, seed, and generation date;
- width, height, aspectRatio, duration, and frameRate when applicable;
- rights, consent, privacy, and provenance states;
- reviewState: PROPOSED, GENERATED, REVIEWED, APPROVED, REJECTED, or SUPERSEDED;
- reviewer and approvalEvidence;
- continuityDependencies;
- knownDefects;
- intendedDownstreamUse;
- createdAt and updatedAt.

Null is used for unknown or not-yet-created data. Empty strings are not substitutes for unknown evidence.

## Additional source state

Source intake needs a state before generation-review states apply:

- MISSING
- RECEIVED
- HASHED
- DUPLICATE
- UNSUITABLE
- RIGHTS_UNKNOWN
- APPROVED_SOURCE

APPROVED_SOURCE is scoped to explicit uses. It never implies permission for every provider, training operation, publication channel, or future derivative.

## Review lifecycle

PROPOSED → GENERATED → REVIEWED → APPROVED

Alternative terminal or branching states:

- GENERATED → REJECTED
- REVIEWED → REJECTED
- any nonterminal version → SUPERSEDED by a linked higher version

Only APPROVED exact versions may feed an approved downstream asset. Unseen angles and interpolated frames remain PROPOSED or GENERATED until reviewed.

## Hashing and version rules

- Source and output files use SHA-256 over original bytes.
- Prompt hashes use SHA-256 over UTF-8 normalized prompt text with LF line endings.
- Settings are serialized as sorted-key JSON before hashing when a combined recipe hash is needed.
- A prompt, model, seed, dimension, reference, or settings change creates a new attempt record.
- A visual correction never overwrites a prior file.
- A retimed, graded, painted, stabilized, compressed, or cropped derivative receives a new ID or version and parent link.

## Privacy and storage rules

- Git: text specifications, schemas, hashes, manifests, and later small approved web assets only.
- Private intake storage: raw source photos and releases.
- Controlled generation storage: generated masters and failed outputs, subject to approved provider/export retention.
- Public delivery: optimized, approved, provenance-linked poster/video derivatives only.
- Never put reusable identity-model secrets, provider tokens, consent documents, or private source URIs in Git.
- Never put private Soul identifiers, provider job identifiers, source filenames, exact private submission timestamps, or account identifiers in Git.
- Local absolute paths may exist in a private intake ledger; committed manifests use controlled aliases such as private-intake://SRC-SAGE-001.

## Quality gates

An asset cannot become APPROVED unless:

1. All source IDs resolve.
2. Rights/consent/privacy fields are explicit and compatible with intended use.
3. Prompt/settings/provenance are reproducible to the extent the model supports.
4. Review checks for its category pass.
5. Reviewer and approval evidence identify the exact version.
6. Known defects are empty or explicitly accepted.
7. Downstream use matches the approval scope.

## Machine-readable files

- manifests/assets.json — planned source, character, wardrobe, environment, lighting, transition, and video asset families.
- manifests/sources.json — sanitized source identities, technical classifications, scoped operation decisions, and unresolved rights states.
- manifests/keyframes.json — the twelve desktop/mobile keyframe specifications and adjacency dependencies.
- manifests/generations.json — append-only provider attempts and review decisions. It records the completed three-candidate OpenAI diagnostic; the authorized Higgsfield Soul route remains unperformed with zero upload, Soul, diagnostic, or credit counts.

Validation command:

    node docs/preproduction/runway-to-resort/validate-preproduction.mjs

The validator checks JSON parsing, allowed states, stable IDs, dimensions/aspect ratios, dependency resolution, duplicate IDs, generation-log immutability expectations, and required prompt-spec links.
