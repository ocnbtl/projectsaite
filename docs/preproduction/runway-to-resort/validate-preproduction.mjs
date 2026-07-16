import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const allowedReviewStates = new Set([
  "PROPOSED",
  "GENERATED",
  "REVIEWED",
  "APPROVED",
  "REJECTED",
  "SUPERSEDED",
]);
const allowedSourceStates = new Set([
  "MISSING",
  "RECEIVED",
  "HASHED",
  "DUPLICATE",
  "UNSUITABLE",
  "RIGHTS_UNKNOWN",
  "APPROVED_SOURCE",
]);
const stableAssetId = /^(CHR-SAGE-(FACE|BODY|EXPR|HAIR|GAIT|CONT)-\d{3}|WARD-(RUNWAY|RESORT)-\d{3}|ENV-(RUNWAY|RESORT)-\d{3}|LIGHT-(RUNWAY|RESORT)-\d{3}|TRANS-OCCLUSION-\d{3}|VID-(RWY|RST|MASTER)-[DM]?(?:-)?\d{3})$/;
const stableKeyframeId = /^KF-0[1-6]$/;
const stableSourceId = /^SRC-SAGE-\d{3}$/;
const stableAttemptId = /^GEN-CHR-SAGE-FACE-001-\d{3}$/;
const errors = [];

function readJson(relativePath) {
  const path = join(root, relativePath);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(relativePath + ": invalid JSON: " + error.message);
    return {};
  }
}

function effective(defaults, record) {
  return {
    ...defaults,
    ...record,
    dimensions: {
      ...(defaults.dimensions ?? {}),
      ...(record.dimensions ?? {}),
    },
  };
}

function requireFields(label, record, fields) {
  for (const field of fields) {
    if (!(field in record)) errors.push(label + ": missing effective field " + field);
  }
}

function validateDimensions(label, dimensions) {
  const { width, height, aspectRatio } = dimensions ?? {};
  if (width == null && height == null && aspectRatio == null) return;
  if (!(Number.isInteger(width) && width > 0 && Number.isInteger(height) && height > 0)) {
    errors.push(label + ": dimensions must use positive integer width/height");
    return;
  }
  if (!/^\d+:\d+$/.test(aspectRatio ?? "")) {
    errors.push(label + ": invalid aspectRatio " + aspectRatio);
    return;
  }
  const [a, b] = aspectRatio.split(":").map(Number);
  if (Math.abs(width / height - a / b) > 0.001) {
    errors.push(label + ": dimensions do not match " + aspectRatio);
  }
}

function validatePromptPath(label, promptSpecPath) {
  if (typeof promptSpecPath !== "string") {
    errors.push(label + ": missing promptSpecPath");
    return;
  }
  const filePath = promptSpecPath.split("#")[0];
  if (!existsSync(join(root, filePath))) {
    errors.push(label + ": prompt spec file not found: " + filePath);
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function validateSanitizedJson(label, value, path = []) {
  const forbiddenKeyFragments = [
    "filename",
    "filepath",
    "privatepath",
    "sourcepath",
    "outputpath",
    "sourcehash",
    "filehash",
    "outputhash",
    "exif",
    "geolocation",
    "latitude",
    "longitude",
    "gps",
    "consentcontents",
    "consentrecord",
  ];
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateSanitizedJson(label, item, [...path, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      const normalized = key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
      if (forbiddenKeyFragments.some((fragment) => normalized.includes(fragment))) {
        errors.push(label + ": forbidden private field " + [...path, key].join("."));
      }
      validateSanitizedJson(label, item, [...path, key]);
    }
    return;
  }
  if (typeof value !== "string") return;
  if (
    /(?:^|[\\/])Users[\\/]/.test(value) ||
    /\b[a-f0-9]{64}\b/i.test(value) ||
    /\.(?:jpe?g|png|heic|tiff?|txt|pdf)\b/i.test(value)
  ) {
    errors.push(label + ": private path, fingerprint, consent name, or binary filename at " + path.join("."));
  }
}

const assetsManifest = readJson("manifests/assets.json");
const keyframeManifest = readJson("manifests/keyframes.json");
const generationManifest = readJson("manifests/generations.json");
const sourcesManifest = readJson("manifests/sources.json");

if (assetsManifest.schemaVersion !== "1.0.0") errors.push("assets.json: unexpected schemaVersion");
if (keyframeManifest.schemaVersion !== "1.0.0") errors.push("keyframes.json: unexpected schemaVersion");
if (generationManifest.schemaVersion !== "1.0.0") errors.push("generations.json: unexpected schemaVersion");
if (sourcesManifest.schemaVersion !== "1.0.0") errors.push("sources.json: unexpected schemaVersion");

const assetIds = new Set();
const keyframeKeys = new Set();
const sourceIds = new Set();

validateSanitizedJson("sources.json", sourcesManifest);
validateSanitizedJson("generations.json", generationManifest);

for (const source of sourcesManifest.sources ?? []) {
  const label = "source " + source.id;
  if (!stableSourceId.test(source.id ?? "")) errors.push(label + ": unstable ID");
  if (sourceIds.has(source.id)) errors.push(label + ": duplicate ID");
  sourceIds.add(source.id);
  if (!allowedSourceStates.has(source.sourceStatus)) errors.push(label + ": invalid sourceStatus");
  if (!["original_photo", "media_kit"].includes(source.kind)) errors.push(label + ": invalid kind");
  if (typeof source.selectedForIdentityBatch !== "boolean") {
    errors.push(label + ": selectedForIdentityBatch must be boolean");
  }
  if (source.duplicateOf != null && !stableSourceId.test(source.duplicateOf)) {
    errors.push(label + ": invalid duplicateOf");
  }
  requireFields(label, source, [
    "id",
    "kind",
    "sourceStatus",
    "duplicateOf",
    "classifications",
    "technicalAssessment",
    "selectedForIdentityBatch",
    "selectionReason",
    "sageLikenessConsent",
    "copyrightLicenseStatus",
    "aiReferencePermission",
    "openAIGenerationPermission",
    "higgsfieldUploadPermission",
    "commercialWebsitePermission",
    "visibleBranding",
    "restrictions",
    "confidence",
    "notes",
    "privacyStatus",
    "provenanceStatus",
    "updatedAt",
  ]);
}

const selectedSourceIds = new Set(
  (sourcesManifest.sources ?? [])
    .filter((source) => source.selectedForIdentityBatch)
    .map((source) => source.id),
);
const expectedSelectedSourceIds = new Set([
  "SRC-SAGE-001",
  "SRC-SAGE-004",
  "SRC-SAGE-005",
  "SRC-SAGE-006",
  "SRC-SAGE-013",
]);
if (sourceIds.size !== 14) errors.push("sources.json: expected exactly 14 source records");
if (
  selectedSourceIds.size !== expectedSelectedSourceIds.size ||
  [...expectedSelectedSourceIds].some((id) => !selectedSourceIds.has(id))
) {
  errors.push("sources.json: selected identity source set does not match the reviewed five-source subset");
}
const sourceSummary = sourcesManifest.summary ?? {};
const originalPhotoCount = (sourcesManifest.sources ?? []).filter(
  (source) => source.kind === "original_photo",
).length;
const mediaKitCount = (sourcesManifest.sources ?? []).filter(
  (source) => source.kind === "media_kit",
).length;
if (
  sourceSummary.sourceMediaFiles !== sourceIds.size ||
  sourceSummary.originalPhotos !== originalPhotoCount ||
  sourceSummary.mediaKitFiles !== mediaKitCount ||
  sourceSummary.exactDuplicateFiles !== 0 ||
  sourceSummary.perceptualNearDuplicateCandidates !== 0 ||
  sourceSummary.selectedForFirstIdentityBatch !== selectedSourceIds.size ||
  sourceSummary.trueProfileViewsAvailable !== 0
) {
  errors.push("sources.json: summary does not match the reviewed intake totals");
}

for (const source of assetsManifest.requiredSources ?? []) {
  if (!allowedSourceStates.has(source.sourceStatus)) {
    errors.push("required source " + source.slot + ": invalid sourceStatus");
  }
  if (source.sourceStatus === "APPROVED_SOURCE") {
    errors.push("required source " + source.slot + ": no supplied source is approved for commercial/public use");
  }
}

for (const raw of assetsManifest.assets ?? []) {
  const label = "asset " + raw.id;
  const record = effective(assetsManifest.recordDefaults ?? {}, raw);
  if (!stableAssetId.test(record.id ?? "")) errors.push(label + ": unstable ID");
  if (assetIds.has(record.id)) errors.push(label + ": duplicate ID");
  assetIds.add(record.id);
  if (!allowedReviewStates.has(record.reviewState)) errors.push(label + ": invalid reviewState");
  requireFields(label, record, [
    "id",
    "version",
    "category",
    "purpose",
    "parentIds",
    "sourceAssetIds",
    "sourceLocation",
    "fileHash",
    "prompt",
    "promptHash",
    "provider",
    "model",
    "workflow",
    "settings",
    "seed",
    "generatedAt",
    "dimensions",
    "rightsStatus",
    "consentStatus",
    "privacyStatus",
    "provenanceStatus",
    "reviewState",
    "reviewer",
    "approvalEvidence",
    "continuityDependencies",
    "knownDefects",
    "intendedDownstreamUse",
    "createdAt",
    "updatedAt",
  ]);
  validateDimensions(label, record.dimensions);
  validatePromptPath(label, record.promptSpecPath);
  for (const sourceId of record.sourceAssetIds ?? []) {
    if (stableSourceId.test(sourceId) && !sourceIds.has(sourceId)) {
      errors.push(label + ": unresolved source asset " + sourceId);
    }
  }
}

for (const raw of keyframeManifest.keyframes ?? []) {
  const label = "keyframe " + raw.id + "::" + raw.variant;
  const record = effective(keyframeManifest.recordDefaults ?? {}, raw);
  const key = record.id + "::" + record.variant;
  if (!stableKeyframeId.test(record.id ?? "")) errors.push(label + ": unstable keyframe ID");
  if (!["desktop", "mobile"].includes(record.variant)) errors.push(label + ": invalid variant");
  if (keyframeKeys.has(key)) errors.push(label + ": duplicate keyframe variant");
  keyframeKeys.add(key);
  if (!allowedReviewStates.has(record.reviewState)) errors.push(label + ": invalid reviewState");
  requireFields(label, record, [
    "id",
    "variant",
    "version",
    "beat",
    "scrollRange",
    "dimensions",
    "fileHash",
    "sourceAssetIds",
    "promptSpecPath",
    "promptHash",
    "model",
    "settings",
    "seed",
    "rightsStatus",
    "consentStatus",
    "privacyStatus",
    "provenanceStatus",
    "reviewState",
    "reviewer",
    "approvalEvidence",
    "continuityDependencies",
    "knownDefects",
    "segmentRoles",
    "purpose",
    "createdAt",
    "updatedAt",
  ]);
  validateDimensions(label, record.dimensions);
  validatePromptPath(label, record.promptSpecPath);
}

const allDependencyIds = new Set([...assetIds, ...keyframeKeys]);
for (const raw of assetsManifest.assets ?? []) {
  const record = effective(assetsManifest.recordDefaults ?? {}, raw);
  for (const dependency of record.continuityDependencies ?? []) {
    if (!allDependencyIds.has(dependency)) {
      errors.push("asset " + record.id + ": unresolved dependency " + dependency);
    }
  }
}
for (const raw of keyframeManifest.keyframes ?? []) {
  const record = effective(keyframeManifest.recordDefaults ?? {}, raw);
  for (const dependency of record.continuityDependencies ?? []) {
    if (!assetIds.has(dependency)) {
      errors.push("keyframe " + record.id + "::" + record.variant + ": unresolved dependency " + dependency);
    }
  }
}

const expectedKeyframes = new Set(
  ["KF-01", "KF-02", "KF-03", "KF-04", "KF-05", "KF-06"].flatMap((id) => [
    id + "::desktop",
    id + "::mobile",
  ]),
);
for (const key of expectedKeyframes) {
  if (!keyframeKeys.has(key)) errors.push("missing required keyframe " + key);
}
if (keyframeKeys.size !== expectedKeyframes.size) {
  errors.push("keyframes.json: expected exactly 12 desktop/mobile keyframe records");
}

const generationAuthorization = generationManifest.authorization ?? {};
if (generationManifest.generationAuthorized !== true) {
  errors.push("generations.json: the bounded first OpenAI diagnostic authorization must be recorded");
}
if (
  generationAuthorization.scope !== "FIRST_PRIVATE_OPENAI_IDENTITY_DIAGNOSTIC_ONLY" ||
  generationAuthorization.assetId !== "CHR-SAGE-FACE-001" ||
  generationAuthorization.provider !== "OpenAI Image Creator" ||
  generationAuthorization.maxCandidates !== 3 ||
  generationAuthorization.publicationAuthorized !== false ||
  generationAuthorization.higgsfieldOperationallyAuthorized !== false ||
  generationAuthorization.productionMutationAuthorized !== false
) {
  errors.push("generations.json: invalid or overbroad generation authorization");
}
const authorizedSourceIds = new Set(generationAuthorization.sourceAssetIds ?? []);
if (
  authorizedSourceIds.size !== expectedSelectedSourceIds.size ||
  [...expectedSelectedSourceIds].some((id) => !authorizedSourceIds.has(id))
) {
  errors.push("generations.json: authorization source set does not match the selected source set");
}
if (
  generationManifest.providerSubmissionsPerformed !== 3 ||
  generationManifest.distinctReferenceAssetsSubmitted !== 5 ||
  generationManifest.referenceAssetsPerSubmission !== 5 ||
  generationManifest.higgsfieldUploadsPerformed !== 0 ||
  generationManifest.productionAssetUploadsPerformed !== 0 ||
  generationManifest.generatedOutputPublicationUploadsPerformed !== 0 ||
  generationManifest.creditsSpent !== 0 ||
  generationManifest.approvedGeneratedAssets !== 0
) {
  errors.push("generations.json: provider-submission, upload, credit, or approval counts are inconsistent");
}
if (!Array.isArray(generationManifest.attempts) || generationManifest.attempts.length !== 3) {
  errors.push("generations.json: expected exactly three authorized attempts");
}
if ((generationManifest.attempts ?? []).length > (generationAuthorization.maxCandidates ?? 0)) {
  errors.push("generations.json: attempt count exceeds authorization");
}
const attemptIds = new Set();
for (const attempt of generationManifest.attempts ?? []) {
  const label = "attempt " + attempt.attemptId;
  if (!stableAttemptId.test(attempt.attemptId ?? "")) errors.push(label + ": unstable attempt ID");
  if (attemptIds.has(attempt.attemptId)) errors.push(label + ": duplicate attempt ID");
  attemptIds.add(attempt.attemptId);
  if (attempt.assetId !== "CHR-SAGE-FACE-001") errors.push(label + ": unexpected asset ID");
  if (attempt.provider !== "OpenAI" || attempt.product !== "ChatGPT Image Creator") {
    errors.push(label + ": unexpected provider or product");
  }
  if (attempt.reviewState !== "REVIEWED" || attempt.assetApprovalState !== "PROPOSED") {
    errors.push(label + ": attempt must be REVIEWED while the asset remains PROPOSED");
  }
  if (attempt.publicOrProductionUseAuthorized !== false) {
    errors.push(label + ": public or production use must remain unauthorized");
  }
  if (attempt.privateOutputFingerprintRecorded !== true) {
    errors.push(label + ": private output fingerprint evidence is missing");
  }
  const attemptSourceIds = new Set(attempt.sourceAssetIds ?? []);
  if (
    attemptSourceIds.size !== expectedSelectedSourceIds.size ||
    [...expectedSelectedSourceIds].some((id) => !attemptSourceIds.has(id))
  ) {
    errors.push(label + ": submitted source set does not match the authorized subset");
  }
  validatePromptPath(label, attempt.promptSpecPath);
  const dimensions = attempt.actualDimensions ?? {};
  if (dimensions.width !== 1983 || dimensions.height !== 793) {
    errors.push(label + ": unexpected output dimensions");
  }
}

const expectedDocs = [
  "00-project-brief.md",
  "01-rights-and-source-register.md",
  "02-asset-manifest.md",
  "03-character-bible.md",
  "04-runway-environment-bible.md",
  "05-resort-environment-bible.md",
  "06-keyframe-specifications.md",
  "07-image-prompts.md",
  "08-video-shot-plan.md",
  "09-generation-log.md",
  "10-web-integration-plan.md",
];
for (const file of expectedDocs) {
  if (!existsSync(join(root, file))) errors.push("missing required document " + file);
}

const allowedExtensions = new Set([".md", ".json", ".mjs"]);
for (const file of walk(root)) {
  if (!allowedExtensions.has(extname(file))) {
    errors.push("unexpected non-text preproduction artifact " + file.slice(root.length + 1));
  }
}

if (errors.length) {
  console.error("Preproduction validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      sources: sourceIds.size,
      selectedIdentitySources: selectedSourceIds.size,
      assets: assetIds.size,
      keyframes: keyframeKeys.size,
      generationAttempts: generationManifest.attempts.length,
      openAIProviderSubmissions: generationManifest.providerSubmissionsPerformed,
      higgsfieldUploadsPerformed: generationManifest.higgsfieldUploadsPerformed,
      productionAssetUploadsPerformed: generationManifest.productionAssetUploadsPerformed,
      creditsSpent: generationManifest.creditsSpent,
      textOnly: true,
    },
    null,
    2,
  ),
);
