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
const stableAssetId = /^(CHR-SAGE-(FACE|BODY|EXPR|HAIR|GAIT|CONT|SOUL)-\d{3}|CHR-SAGE-SOUL-DIAG-\d{3}|WARD-(RUNWAY|RESORT)-\d{3}|ENV-(RUNWAY|RESORT)-\d{3}|LIGHT-(RUNWAY|RESORT)-\d{3}|TRANS-OCCLUSION-\d{3}|VID-(RWY|RST|MASTER)-[DM]?(?:-)?\d{3})$/;
const stableKeyframeId = /^KF-0[1-6]$/;
const stableSourceId = /^SRC-SAGE-\d{3}$/;
const stableHistoricalAttemptId = /^GEN-CHR-SAGE-FACE-001-\d{3}$/;
const stableSoulDiagnosticAttemptId = /^GEN-CHR-SAGE-SOUL-DIAG-001-\d{3}$/;
const stableSoulRunId = /^RUN-CHR-SAGE-SOUL-001-\d{3}$/;
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

function setsEqual(actual, expected) {
  return actual.size === expected.size && [...expected].every((value) => actual.has(value));
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
    "provideridentifier",
    "accountidentifier",
    "accountbalance",
    "creditsbefore",
    "creditsafter",
    "netbalance",
    "jobidentifier",
    "soulidentifier",
  ];
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateSanitizedJson(label, item, [...path, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      const normalized = key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
      const containsPrivateValue = item != null && item !== "" && item !== false;
      if (containsPrivateValue && forbiddenKeyFragments.some((fragment) => normalized.includes(fragment))) {
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
if (
  assetsManifest.recordDefaults?.rightsStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
  assetsManifest.recordDefaults?.consentStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW"
) {
  errors.push("asset defaults must preserve confirmed workflow authority");
}

const assetIds = new Set();
const assetRecords = new Map();
const keyframeKeys = new Set();
const sourceIds = new Set();

validateSanitizedJson("sources.json", sourcesManifest);
validateSanitizedJson("generations.json", generationManifest);
validateSanitizedJson("assets.json", assetsManifest);

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
    "selectedForFirstSoulTraining",
    "soulTrainingInputMode",
    "soulTrainingSelectionReason",
    "ownerHiggsfieldAuthorization",
    "providerComplianceState",
    "updatedAt",
  ]);
}

const historicalOpenAISourceIds = new Set(
  (sourcesManifest.sources ?? [])
    .filter((source) => source.selectedForIdentityBatch)
    .map((source) => source.id),
);
const expectedOpenAIDiagnosticSourceIds = new Set([
  "SRC-SAGE-001",
  "SRC-SAGE-004",
  "SRC-SAGE-005",
  "SRC-SAGE-006",
  "SRC-SAGE-013",
]);
const expectedSoulTrainingSourceIds = new Set(
  Array.from({ length: 13 }, (_, index) => `SRC-SAGE-${String(index + 1).padStart(3, "0")}`),
);
const executedSoulSourceIds = new Set(
  (sourcesManifest.sources ?? [])
    .filter((source) => source.selectedForFirstSoulTraining)
    .map((source) => source.id),
);
if (sourceIds.size !== 14) errors.push("sources.json: expected exactly 14 source records");
if (!setsEqual(historicalOpenAISourceIds, expectedOpenAIDiagnosticSourceIds)) {
  errors.push("sources.json: selected identity source set does not match the reviewed five-source subset");
}
if (!setsEqual(executedSoulSourceIds, expectedSoulTrainingSourceIds)) {
  errors.push("sources.json: executed Soul set must contain exactly the thirteen original photographs");
}
for (const source of sourcesManifest.sources ?? []) {
  const label = "source " + source.id;
  if (expectedSoulTrainingSourceIds.has(source.id)) {
    if (
      source.kind !== "original_photo" ||
      source.sourceStatus !== "APPROVED_SOURCE" ||
      source.duplicateOf !== null ||
      source.selectedForFirstSoulTraining !== true ||
      source.soulTrainingInputMode !== "ORIGINAL_FILE_UNCHANGED" ||
      source.ownerHiggsfieldAuthorization !== "AUTHORIZED_AND_EXECUTED_ONE_PRIVATE_SOUL_RUN" ||
      source.providerComplianceState !== "ACCEPTED_AND_EXECUTED" ||
      source.copyrightLicenseStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
      source.commercialWebsitePermission !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
      source.higgsfieldUploadPermission !== "CONFIRMED_AND_EXECUTED_ONE_UNCHANGED_SOUL_RUN" ||
      !(source.restrictions ?? []).includes("ORIGINAL_FILE_SUBMITTED_UNCHANGED_FOR_FIRST_SOUL_RUN") ||
      !(source.restrictions ?? []).includes("NO_UNINTENDED_OUTPUT_LOGOS_OR_COPIED_BRAND_MARKS")
    ) {
      errors.push(label + ": invalid executed unchanged-original Soul authorization or rights state");
    }
  } else if (source.id === "SRC-SAGE-014") {
    if (
      source.kind !== "media_kit" ||
      source.selectedForFirstSoulTraining !== false ||
      source.soulTrainingInputMode !== "EXCLUDED_AI_MEDIA_KIT" ||
      source.ownerHiggsfieldAuthorization !== "NOT_AUTHORIZED_EXCLUDED_AI_MEDIA_KIT" ||
      source.providerComplianceState !== "EXCLUDED_NOT_SUBMITTABLE" ||
      source.higgsfieldUploadPermission !== "NOT_AUTHORIZED_EXCLUDED_AI_MEDIA_KIT"
    ) {
      errors.push(label + ": AI media-kit artifact must remain excluded from Soul training");
    }
  }
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
  sourceSummary.selectedForFirstIdentityBatch !== historicalOpenAISourceIds.size ||
  sourceSummary.selectedOriginalInputsForFirstSoulRun !== executedSoulSourceIds.size ||
  sourceSummary.submittedOriginalInputsForFirstSoulRun !== 13 ||
  sourceSummary.acceptedOriginalInputsForFirstSoulRun !== 13 ||
  sourceSummary.excludedInputsForFirstSoulRun !== 1 ||
  sourceSummary.trueProfileViewsAvailable !== 0
) {
  errors.push("sources.json: summary does not match the reviewed intake totals");
}
const soulInputSet = sourcesManifest.soulInputSet ?? {};
if (
  soulInputSet.state !== "EXECUTED_COMPLETED" ||
  soulInputSet.selectionMode !== "ORIGINAL_FILE_UNCHANGED" ||
  !setsEqual(new Set(soulInputSet.selectedSourceIds ?? []), expectedSoulTrainingSourceIds) ||
  !setsEqual(new Set(soulInputSet.excludedSourceIds ?? []), new Set(["SRC-SAGE-014"])) ||
  soulInputSet.generatedDerivativesAllowed !== false ||
  soulInputSet.historicalFirstIdentityBatchSelectionPreserved !== true ||
  soulInputSet.rightsStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
  soulInputSet.commercialWebsitePermission !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
  soulInputSet.uploadState !== "SUBMITTED_ONCE_ALL_ACCEPTED" ||
  soulInputSet.submittedInputCount !== 13 ||
  soulInputSet.acceptedInputCount !== 13 ||
  soulInputSet.exactDuplicateCount !== 0 ||
  soulInputSet.ownerHiggsfieldAuthorization !== "AUTHORIZED_AND_EXECUTED_ONE_PRIVATE_SOUL_RUN" ||
  soulInputSet.providerComplianceState !== "ACCEPTED_AND_EXECUTED" ||
  soulInputSet.executionEvidence?.allSelectedInputsSubmittedUnchanged !== true ||
  soulInputSet.executionEvidence?.allSelectedInputsAccepted !== true ||
  soulInputSet.executionEvidence?.selectedVariant !== "soul-cinematic" ||
  soulInputSet.executionEvidence?.soulRunsSubmitted !== 1 ||
  soulInputSet.executionEvidence?.soulsCompleted !== 1 ||
  soulInputSet.executionEvidence?.trainingCreditsSpent !== 25
) {
  errors.push("sources.json: completed Soul input contract is inconsistent");
}

let approvedRequiredSources = 0;
for (const source of assetsManifest.requiredSources ?? []) {
  if (!allowedSourceStates.has(source.sourceStatus)) {
    errors.push("required source " + source.slot + ": invalid sourceStatus");
  }
  if (source.sourceStatus === "APPROVED_SOURCE") approvedRequiredSources += 1;
}
if (approvedRequiredSources !== 3) errors.push("assets.json: exactly three original-source families must be approved");

for (const raw of assetsManifest.assets ?? []) {
  const label = "asset " + raw.id;
  const record = effective(assetsManifest.recordDefaults ?? {}, raw);
  if (!stableAssetId.test(record.id ?? "")) errors.push(label + ": unstable ID");
  if (assetIds.has(record.id)) errors.push(label + ": duplicate ID");
  assetIds.add(record.id);
  assetRecords.set(record.id, record);
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

const expectedDiagnosticViewKeys = [
  "CLOSE_NEUTRAL_PORTRAIT",
  "WAIST_UP_NEUTRAL",
  "FULL_BODY_FRONT",
  "FULL_BODY_THREE_QUARTER_LEFT",
  "FULL_BODY_THREE_QUARTER_RIGHT",
  "FULL_BODY_SIDE",
  "SIMPLE_RUNWAY_WALK",
];
const allowedSoulDecisionValues = [
  "APPROVED FOR KEYFRAME DEVELOPMENT",
  "RETRAIN WITH ALL ORIGINALS PLUS ADDITIONAL REAL PHOTOS",
  "NEEDS CONTROLLED FULL-BODY OR PROFILE CAPTURE",
  "REJECTED",
];

const historicalFaceAsset = assetRecords.get("CHR-SAGE-FACE-001") ?? {};
if (
  historicalFaceAsset.purpose !== "Archived synthetic five-view face diagnostic" ||
  historicalFaceAsset.promptSpecPath !== "prompts/character/reference-sheets.md#chr-sage-face-001--archived-synthetic-face-diagnostic" ||
  historicalFaceAsset.settings?.userPreferredComparisonAttemptId !== "GEN-CHR-SAGE-FACE-001-003" ||
  historicalFaceAsset.settings?.supersededComparisonAttemptId !== "GEN-CHR-SAGE-FACE-001-002" ||
  historicalFaceAsset.settings?.allGeneratedAttemptsExcludedFromPlannedSoulInput !== true ||
  historicalFaceAsset.reviewState !== "PROPOSED" ||
  !String(historicalFaceAsset.intendedDownstreamUse ?? "").startsWith("Historical comparison only")
) {
  errors.push("assets.json: historical face diagnostic must record Candidate 003 preference without approval or Soul eligibility");
}

const completedSoulAsset = assetRecords.get("CHR-SAGE-SOUL-001") ?? {};
if (
  completedSoulAsset.provider !== "Higgsfield" ||
  completedSoulAsset.model !== "Soul ID — cinematic variant" ||
  completedSoulAsset.workflow !== "ONE_PRIVATE_SOUL_CINEMATIC_TRAINING_RUN" ||
  completedSoulAsset.promptSpecPath !== "prompts/character/soul-diagnostic.md#training-contract" ||
  !setsEqual(new Set(completedSoulAsset.sourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  completedSoulAsset.rightsStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
  completedSoulAsset.privacyStatus !== "PRIVATE" ||
  completedSoulAsset.provenanceStatus !== "COMPLETED_SOURCE_LINKED_PRIVATE_PROVIDER_RUN" ||
  completedSoulAsset.reviewState !== "APPROVED" ||
  completedSoulAsset.settings?.authorizedPrivateRunCount !== 1 ||
  completedSoulAsset.settings?.selectedOriginalInputCount !== 13 ||
  completedSoulAsset.settings?.inputPolicy !== "ORIGINAL_SOURCE_FILES_UNCHANGED" ||
  completedSoulAsset.settings?.uploadedInputCount !== 13 ||
  completedSoulAsset.settings?.acceptedInputCount !== 13 ||
  completedSoulAsset.settings?.submittedRunCount !== 1 ||
  completedSoulAsset.settings?.createdSoulCount !== 1 ||
  completedSoulAsset.settings?.trainingCreditsSpent !== 25 ||
  completedSoulAsset.settings?.generatedCandidatesEligibleAsInputs !== false ||
  completedSoulAsset.settings?.selectedVariant !== "soul-cinematic"
) {
  errors.push("assets.json: completed Soul asset is missing verified execution fields");
}

const completedSoulDiagnosticAsset = assetRecords.get("CHR-SAGE-SOUL-DIAG-001") ?? {};
if (
  completedSoulDiagnosticAsset.provider !== "Higgsfield" ||
  completedSoulDiagnosticAsset.model !== "Soul Cinema" ||
  completedSoulDiagnosticAsset.workflow !== "PRIVATE_SOUL_CINEMA_IDENTITY_DIAGNOSTICS" ||
  completedSoulDiagnosticAsset.promptSpecPath !== "prompts/character/soul-diagnostic.md#diagnostic-output-contract" ||
  !setsEqual(new Set(completedSoulDiagnosticAsset.sourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  !setsEqual(new Set(completedSoulDiagnosticAsset.continuityDependencies ?? []), new Set(["CHR-SAGE-SOUL-001"])) ||
  completedSoulDiagnosticAsset.rightsStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
  completedSoulDiagnosticAsset.privacyStatus !== "PRIVATE" ||
  completedSoulDiagnosticAsset.reviewState !== "APPROVED" ||
  completedSoulDiagnosticAsset.settings?.authorizedMaximumDiagnostics !== 7 ||
  completedSoulDiagnosticAsset.settings?.submittedDiagnostics !== 7 ||
  completedSoulDiagnosticAsset.settings?.completedDiagnostics !== 7 ||
  completedSoulDiagnosticAsset.settings?.diagnosticCreditsSpent !== 0.84 ||
  completedSoulDiagnosticAsset.settings?.concurrentProviderRewardGrantCredits !== 10 ||
  !setsEqual(new Set(completedSoulDiagnosticAsset.settings?.orderedDiagnosticViewKeys ?? []), new Set(expectedDiagnosticViewKeys)) ||
  !setsEqual(new Set(completedSoulDiagnosticAsset.settings?.allowedDecisionValues ?? []), new Set(allowedSoulDecisionValues)) ||
  completedSoulDiagnosticAsset.settings?.decision !== "APPROVED FOR KEYFRAME DEVELOPMENT" ||
  completedSoulDiagnosticAsset.settings?.originalPhotosRemainAuthoritative !== true ||
  completedSoulDiagnosticAsset.settings?.candidate003Role !== "SECONDARY_COMPARISON_ONLY" ||
  completedSoulDiagnosticAsset.settings?.keyframeCampaignAuthorized !== true ||
  completedSoulDiagnosticAsset.settings?.videoCampaignAuthorized !== true ||
  completedSoulDiagnosticAsset.settings?.sitePreviewCampaignAuthorized !== true ||
  completedSoulDiagnosticAsset.settings?.productionDeploymentPerformed !== false ||
  completedSoulDiagnosticAsset.settings?.mainMergePerformed !== false ||
  !(completedSoulDiagnosticAsset.knownDefects ?? []).includes("DIAG_04_INVENTED_TATTOOS_REJECTED")
) {
  errors.push("assets.json: completed Soul diagnostic asset is missing the approved seven-view gate");
}

for (const [assetId, record] of assetRecords) {
  if (assetId === "CHR-SAGE-FACE-001") continue;
  if (
    (record.sourceAssetIds ?? []).includes("CHR-SAGE-FACE-001") ||
    (record.continuityDependencies ?? []).includes("CHR-SAGE-FACE-001")
  ) {
    errors.push("asset " + assetId + ": archived synthetic diagnostic cannot be a downstream prerequisite");
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

const expectedCorrectedKeyframes = new Set([
  "KF-01::desktop",
  "KF-01::mobile",
  "KF-02::desktop",
  "KF-02::mobile",
  "KF-05::desktop",
  "KF-05::mobile",
]);
const expectedDeterministicKeyframes = new Set([
  "KF-03::desktop",
  "KF-03::mobile",
  "KF-04::desktop",
  "KF-04::mobile",
]);
for (const raw of keyframeManifest.keyframes ?? []) {
  const record = effective(keyframeManifest.recordDefaults ?? {}, raw);
  const key = record.id + "::" + record.variant;
  if (
    record.reviewState !== "APPROVED" ||
    record.provenanceStatus !== "COMPLETED_PRIVATE_GENERATION_REVIEWED" ||
    record.rightsStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
    record.consentStatus !== "CONFIRMED_COMPLETE_PROJECT_WORKFLOW" ||
    record.privacyStatus !== "PRIVATE"
  ) {
    errors.push("keyframe " + key + ": selected-keyframe review boundary is incomplete");
  }
  if (
    expectedCorrectedKeyframes.has(key) &&
    (record.version !== 2 ||
      record.model !== "GPT Image 2" ||
      record.settings?.quality !== "high" ||
      record.settings?.sizeClass !== "2k" ||
      record.settings?.method !== "CONTROLLED_KEYFRAME_CORRECTION")
  ) {
    errors.push("keyframe " + key + ": controlled correction recipe is inconsistent");
  }
  if (
    expectedDeterministicKeyframes.has(key) &&
    (record.version !== 2 ||
      record.model !== "Deterministic raster derivation" ||
      record.settings?.providerCreditsSpent !== 0)
  ) {
    errors.push("keyframe " + key + ": deterministic transition recipe is inconsistent");
  }
}
const selectedKeyframeRecords = new Map(
  (keyframeManifest.keyframes ?? []).map((raw) => {
    const record = effective(keyframeManifest.recordDefaults ?? {}, raw);
    return [record.id + "::" + record.variant, record];
  }),
);
if (
  selectedKeyframeRecords.get("KF-06::desktop")?.version !== 4 ||
  selectedKeyframeRecords.get("KF-06::mobile")?.version !== 5
) {
  errors.push("keyframes.json: expected accepted KF-06 desktop v4 and mobile v5");
}

const expectedMotionAssets = new Map([
  ["VID-RWY-D-001", "16:9"],
  ["VID-RWY-D-002", "16:9"],
  ["VID-RST-D-001", "16:9"],
  ["VID-RST-D-002", "16:9"],
  ["VID-RWY-M-001", "9:16"],
  ["VID-RWY-M-002", "9:16"],
  ["VID-RST-M-001", "9:16"],
  ["VID-RST-M-002", "9:16"],
]);
for (const [assetId, aspectRatio] of expectedMotionAssets) {
  const record = assetRecords.get(assetId) ?? {};
  if (
    record.provider !== "Higgsfield" ||
    record.model !== "Seedance 2.0" ||
    record.settings?.durationSeconds !== 5 ||
    record.settings?.resolution !== "1080p" ||
    record.settings?.quality !== "standard" ||
    record.settings?.bitrate !== "high" ||
    record.settings?.audio !== false ||
    record.settings?.grossCreditsSpent !== 45 ||
    record.dimensions?.aspectRatio !== aspectRatio ||
    record.dimensions?.durationSeconds !== 5 ||
    record.reviewState !== "APPROVED" ||
    record.provenanceStatus !== "COMPLETED_PRIVATE_PROVIDER_SEGMENT_REVIEWED"
  ) {
    errors.push("assets.json: reviewed motion segment is inconsistent for " + assetId);
  }
}
const acceptedReplacementSegment = assetRecords.get("VID-RST-M-001") ?? {};
const ordinaryMobileResolveSegment = assetRecords.get("VID-RST-M-002") ?? {};
if (
  acceptedReplacementSegment.workflow !== "START_END_INTERPOLATED_SILENT_SEGMENT_REPLACEMENT" ||
  acceptedReplacementSegment.settings?.acceptedReplacementForRefundedFailedAttempt !== true ||
  ordinaryMobileResolveSegment.workflow !== "START_END_INTERPOLATED_SILENT_SEGMENT" ||
  ordinaryMobileResolveSegment.settings?.acceptedReplacementForRefundedFailedAttempt != null
) {
  errors.push("assets.json: refunded failure and bounded replacement must be attached only to VID-RST-M-001");
}
for (const [assetId, aspectRatio] of [
  ["VID-MASTER-D-001", "16:9"],
  ["VID-MASTER-M-001", "9:16"],
]) {
  const record = assetRecords.get(assetId) ?? {};
  if (
    record.settings?.targetDurationSeconds !== 20 ||
    record.settings?.actualDurationSeconds !== 20.125 ||
    record.settings?.frameRate !== 24 ||
    record.settings?.audio !== false ||
    !setsEqual(new Set(record.settings?.previewCodecs ?? []), new Set(["H264", "VP9"])) ||
    record.settings?.previewDerivativeCount !== 2 ||
    record.settings?.individualDerivativeSizeResult !== "BOTH_UNDER_4_3_MB" ||
    record.settings?.visibility !== "PROTECTED_PREVIEW_ONLY" ||
    record.settings?.verificationResult !== "DELIVERY_ASSETS_VERIFIED" ||
    record.dimensions?.aspectRatio !== aspectRatio ||
    record.dimensions?.durationSeconds !== 20.125 ||
    record.provenanceStatus !== "COMPLETED_VERIFIED_PROTECTED_PREVIEW_DELIVERY" ||
    record.reviewState !== "APPROVED"
  ) {
    errors.push("assets.json: preview master assembly record is inconsistent for " + assetId);
  }
}

const generationAuthorization = generationManifest.historicalOpenAIBatchAuthorization ?? {};
if (generationManifest.generationAuthorized !== true) {
  errors.push("generations.json: the bounded first OpenAI diagnostic authorization must be recorded");
}
if (
  generationAuthorization.scope !== "FIRST_PRIVATE_OPENAI_IDENTITY_DIAGNOSTIC_ONLY" ||
  generationAuthorization.assetId !== "CHR-SAGE-FACE-001" ||
  generationAuthorization.provider !== "OpenAI Image Creator" ||
  generationAuthorization.maxCandidates !== 3 ||
  generationAuthorization.publicationAuthorized !== false ||
  generationAuthorization.productionMutationAuthorized !== false ||
  generationAuthorization.executionState !== "COMPLETED_HISTORICAL_BATCH" ||
  generationAuthorization.higgsfieldOperationalAuthorizationAtExecution !== "NOT_APPLICABLE_TO_OPENAI_BATCH"
) {
  errors.push("generations.json: invalid or overbroad historical OpenAI Batch 001 authorization");
}
const authorizedSourceIds = new Set(generationAuthorization.sourceAssetIds ?? []);
if (!setsEqual(authorizedSourceIds, expectedOpenAIDiagnosticSourceIds)) {
  errors.push("generations.json: authorization source set does not match the selected source set");
}
if (
  generationManifest.openAIProviderSubmissionsPerformed !== 3 ||
  generationManifest.distinctReferenceAssetsSubmitted !== 5 ||
  generationManifest.referenceAssetsPerSubmission !== 5 ||
  generationManifest.higgsfieldUploadsPerformed !== 13 ||
  generationManifest.productionAssetUploadsPerformed !== 0 ||
  generationManifest.generatedOutputPublicationUploadsPerformed !== 0 ||
  generationManifest.grossHiggsfieldCreditsCharged !== 523.76 ||
  generationManifest.higgsfieldCreditsRefunded !== 45 ||
  generationManifest.grossHiggsfieldCreditsSpent !== 478.76 ||
  generationManifest.concurrentProviderRewardGrantCredits !== 10 ||
  generationManifest.approvedPublicDeliveryAssets !== 0 ||
  generationManifest.verifiedProtectedPreviewDeliveryAssets !== 6
) {
  errors.push("generations.json: provider-submission, upload, credit, or approval counts are inconsistent");
}
if (
  Math.abs(
    generationManifest.grossHiggsfieldCreditsSpent +
      generationManifest.higgsfieldCreditsRefunded -
      generationManifest.grossHiggsfieldCreditsCharged,
  ) > 1e-9
) {
  errors.push("generations.json: successful spend plus refund does not reconcile to total charged");
}

const keyframeWorkflow = generationManifest.keyframeWorkflow ?? {};
const privateSupportingSpend = keyframeWorkflow.successfulPrivateExploratoryControlRevisionBatches ?? {};
const expectedPrivateSupportingBatches = new Map([
  ["INITIAL_TWO_OUTPUT_TRANCHE", 0.24],
  ["TWO_OUTPUT_REVISION", 0.24],
  ["TEN_OUTPUT_TRANCHE", 1.2],
  ["LAYOUT_CONTROLS_AND_POSTER_EXPLORATION", 14.24],
  ["MOBILE_HAIR_CONTINUITY_REVISION", 7],
  ["POSTER_WARDROBE_EDITS", 14],
  ["RUNWAY_LAYOUT_CONTROLS", 14],
]);
const actualPrivateSupportingBatches = new Map(
  (privateSupportingSpend.batches ?? []).map((batch) => [batch.batchType, batch.grossCreditsSpent]),
);
if (
  keyframeWorkflow.executionState !== "TWELVE_SELECTED_ANCHORS_REVIEWED" ||
  keyframeWorkflow.selectedKeyframeCount !== 12 ||
  keyframeWorkflow.selectedDesktopCount !== 6 ||
  keyframeWorkflow.selectedMobileCount !== 6 ||
  keyframeWorkflow.controlledCorrectionBatch?.provider !== "Higgsfield" ||
  keyframeWorkflow.controlledCorrectionBatch?.model !== "GPT Image 2" ||
  keyframeWorkflow.controlledCorrectionBatch?.acceptedCount !== 6 ||
  keyframeWorkflow.controlledCorrectionBatch?.grossCreditsSpent !== 42 ||
  !setsEqual(new Set(keyframeWorkflow.controlledCorrectionBatch?.selectedKeys ?? []), expectedCorrectedKeyframes) ||
  keyframeWorkflow.deterministicTransitionBatch?.acceptedCount !== 4 ||
  keyframeWorkflow.deterministicTransitionBatch?.grossCreditsSpent !== 0 ||
  !setsEqual(new Set(keyframeWorkflow.deterministicTransitionBatch?.selectedKeys ?? []), expectedDeterministicKeyframes) ||
  privateSupportingSpend.grossCreditsSpent !== 50.92 ||
  actualPrivateSupportingBatches.size !== expectedPrivateSupportingBatches.size ||
  [...expectedPrivateSupportingBatches].some(([batchType, spend]) => actualPrivateSupportingBatches.get(batchType) !== spend) ||
  privateSupportingSpend.assetScope !== "PRIVATE_EXPLORATORY_CONTROL_AND_REVISION_ONLY" ||
  privateSupportingSpend.eligibleAsSoulInputs !== false ||
  privateSupportingSpend.publicDeliveryAssets !== false ||
  privateSupportingSpend.privateOperationalRecordsPreservedOutsideGit !== true ||
  keyframeWorkflow.reviewState !== "APPROVED_FOR_PROTECTED_PREVIEW_ASSEMBLY" ||
  keyframeWorkflow.privateOperationalRecordsPreservedOutsideGit !== true
) {
  errors.push("generations.json: selected keyframe workflow is inconsistent");
}

const motionWorkflow = generationManifest.motionWorkflow ?? {};
const motionSettings = motionWorkflow.successfulSegmentSettings ?? {};
const failedMotionAttempt = motionWorkflow.failedRefundedAttempt ?? {};
const motionAssembly = motionWorkflow.assembly ?? {};
if (
  motionWorkflow.executionState !== "EIGHT_SEGMENTS_REVIEWED_DELIVERY_ASSEMBLY_COMPLETE_VERIFIED" ||
  motionWorkflow.provider !== "Higgsfield" ||
  motionWorkflow.model !== "Seedance 2.0" ||
  motionWorkflow.successfulSegmentCount !== 8 ||
  motionWorkflow.desktopSegmentCount !== 4 ||
  motionWorkflow.mobileSegmentCount !== 4 ||
  !setsEqual(new Set(motionWorkflow.successfulSegmentAssetIds ?? []), new Set(expectedMotionAssets.keys())) ||
  motionSettings.durationSeconds !== 5 ||
  motionSettings.resolution !== "1080p" ||
  motionSettings.quality !== "standard" ||
  motionSettings.bitrate !== "high" ||
  motionSettings.audio !== false ||
  motionSettings.grossCreditsPerSuccessfulSegment !== 45 ||
  motionWorkflow.grossSuccessfulSegmentCreditsSpent !== 360 ||
  motionWorkflow.failedRefundedAttemptCount !== 1 ||
  failedMotionAttempt.segmentAssetId !== "VID-RST-M-001" ||
  failedMotionAttempt.chargedCredits !== 45 ||
  failedMotionAttempt.refundedCredits !== 45 ||
  failedMotionAttempt.replacementSubmitted !== true ||
  failedMotionAttempt.replacementReviewState !== "APPROVED" ||
  motionWorkflow.visualReview?.structuralChecksPassed !== 8 ||
  motionWorkflow.visualReview?.contactSheetChecksPassed !== 8 ||
  motionWorkflow.visualReview?.successfulSegmentsApprovedForAssembly !== 8 ||
  motionAssembly.targetDurationSeconds !== 20 ||
  motionAssembly.actualDurationSeconds !== 20.125 ||
  motionAssembly.targetFrameRate !== 24 ||
  motionAssembly.audio !== false ||
  !setsEqual(new Set(motionAssembly.previewDerivativeCodecs ?? []), new Set(["H264", "VP9"])) ||
  motionAssembly.previewDerivativeCount !== 4 ||
  motionAssembly.posterAssetCount !== 2 ||
  motionAssembly.verifiedProtectedPreviewAssetCount !== 6 ||
  motionAssembly.individualDerivativeSizeResult !== "ALL_FOUR_UNDER_4_3_MB" ||
  motionAssembly.verificationResult !== "DELIVERY_ASSETS_VERIFIED" ||
  motionAssembly.hiddenCutTreatment !== "DETERMINISTIC_FULL_BLACK_FINISH_AT_HIDDEN_CUT" ||
  motionAssembly.visibility !== "PROTECTED_PREVIEW_ONLY" ||
  motionAssembly.state !== "COMPLETE_VERIFIED" ||
  motionWorkflow.productionDeploymentPerformed !== false ||
  motionWorkflow.mainMergePerformed !== false ||
  motionWorkflow.privateOperationalRecordsPreservedOutsideGit !== true
) {
  errors.push("generations.json: motion execution or preview assembly record is inconsistent");
}
const successfulSpendFromRecordedComponents =
  25 +
  0.84 +
  (privateSupportingSpend.grossCreditsSpent ?? 0) +
  (keyframeWorkflow.controlledCorrectionBatch?.grossCreditsSpent ?? 0) +
  (motionWorkflow.grossSuccessfulSegmentCreditsSpent ?? 0);
if (
  Math.abs(successfulSpendFromRecordedComponents - 478.76) > 1e-9 ||
  Math.abs(successfulSpendFromRecordedComponents - generationManifest.grossHiggsfieldCreditsSpent) > 1e-9
) {
  errors.push("generations.json: successful provider-spend components do not reconcile to 478.76 credits");
}
if (!Array.isArray(generationManifest.attempts) || generationManifest.attempts.length !== 3) {
  errors.push("generations.json: expected exactly three authorized attempts");
}
if ((generationManifest.attempts ?? []).length > (generationAuthorization.maxCandidates ?? 0)) {
  errors.push("generations.json: attempt count exceeds authorization");
}
const attemptIds = new Set();
const attemptRecords = new Map();
for (const attempt of generationManifest.attempts ?? []) {
  const label = "attempt " + attempt.attemptId;
  if (!stableHistoricalAttemptId.test(attempt.attemptId ?? "")) errors.push(label + ": unstable attempt ID");
  if (attemptIds.has(attempt.attemptId)) errors.push(label + ": duplicate attempt ID");
  attemptIds.add(attempt.attemptId);
  attemptRecords.set(attempt.attemptId, attempt);
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
  if (attempt.eligibleForPlannedSoulInput !== false) {
    errors.push(label + ": generated diagnostics must never become Soul inputs");
  }
  if (attempt.privateOutputFingerprintRecorded !== true) {
    errors.push(label + ": private output fingerprint evidence is missing");
  }
  const attemptSourceIds = new Set(attempt.sourceAssetIds ?? []);
  if (!setsEqual(attemptSourceIds, expectedOpenAIDiagnosticSourceIds)) {
    errors.push(label + ": submitted source set does not match the authorized subset");
  }
  validatePromptPath(label, attempt.promptSpecPath);
  const dimensions = attempt.actualDimensions ?? {};
  if (dimensions.width !== 1983 || dimensions.height !== 793) {
    errors.push(label + ": unexpected output dimensions");
  }
}

const comparisonDecision = generationManifest.identityComparisonDecision ?? {};
const candidate002 = attemptRecords.get("GEN-CHR-SAGE-FACE-001-002") ?? {};
const candidate003 = attemptRecords.get("GEN-CHR-SAGE-FACE-001-003") ?? {};
if (
  comparisonDecision.userPreferredAttemptId !== "GEN-CHR-SAGE-FACE-001-003" ||
  comparisonDecision.supersededAttemptId !== "GEN-CHR-SAGE-FACE-001-002" ||
  comparisonDecision.preferenceScope !== "COMPARISON_DIRECTION_ONLY" ||
  comparisonDecision.approvalState !== "NOT_APPROVED" ||
  comparisonDecision.eligibleForPlannedSoulInput !== false ||
  candidate002.disposition !== "SUPERSEDED_REVISION_BASELINE_NOT_APPROVED" ||
  candidate002.comparisonStatus !== "SUPERSEDED_BY_USER_PREFERRED_ATTEMPT" ||
  candidate002.supersededByAttemptId !== "GEN-CHR-SAGE-FACE-001-003" ||
  candidate003.disposition !== "USER_PREFERRED_COMPARISON_NOT_APPROVED" ||
  candidate003.comparisonStatus !== "USER_PREFERRED_COMPARISON" ||
  candidate003.supersedesAttemptId !== "GEN-CHR-SAGE-FACE-001-002"
) {
  errors.push("generations.json: Candidate 003 preference and Candidate 002 supersession are not recorded safely");
}

const soulWorkflow = generationManifest.soulWorkflow ?? {};
const soulExecutionCounts = soulWorkflow.executionCounts ?? {};
if (
  soulWorkflow.authorizationScope !== "COMPLETED_ONE_PRIVATE_SOUL_RUN_AND_SEVEN_PRIVATE_DIAGNOSTICS_KEYFRAME_VIDEO_SITE_PREVIEW_AUTHORIZED" ||
  soulWorkflow.preflightState !== "PASSED_AND_EXECUTED" ||
  soulWorkflow.provider !== "Higgsfield" ||
  soulWorkflow.soulAssetId !== "CHR-SAGE-SOUL-001" ||
  soulWorkflow.diagnosticAssetId !== "CHR-SAGE-SOUL-DIAG-001" ||
  soulWorkflow.authorizedPrivateRunCount !== 1 ||
  soulWorkflow.authorizedMaximumDiagnostics !== 7 ||
  !setsEqual(new Set(soulWorkflow.selectedSourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  soulWorkflow.selectedInputPolicy !== "ORIGINAL_SOURCE_FILES_UNCHANGED" ||
  !setsEqual(new Set(soulWorkflow.excludedSourceAssetIds ?? []), new Set(["SRC-SAGE-014"])) ||
  !setsEqual(new Set(soulWorkflow.excludedAttemptIds ?? []), attemptIds) ||
  soulWorkflow.identityModel !== "Soul ID — cinematic variant" ||
  soulWorkflow.diagnosticModel !== "Soul Cinema" ||
  soulWorkflow.selectedVariant !== "soul-cinematic" ||
  soulWorkflow.selectedVariantFlag !== "--soul-cinematic" ||
  soulWorkflow.privacyState !== "PRIVATE_PROVIDER_WORKFLOW" ||
  JSON.stringify(soulWorkflow.orderedDiagnosticViewKeys ?? []) !== JSON.stringify(expectedDiagnosticViewKeys) ||
  !setsEqual(new Set(soulWorkflow.allowedDecisionValues ?? []), new Set(allowedSoulDecisionValues)) ||
  soulWorkflow.diagnosticDecision !== "APPROVED FOR KEYFRAME DEVELOPMENT" ||
  soulWorkflow.originalPhotosRemainAuthoritative !== true ||
  soulWorkflow.candidate003Role !== "SECONDARY_COMPARISON_ONLY_NOT_TRAINING_INPUT" ||
  soulWorkflow.keyframeCampaignAuthorized !== true ||
  soulWorkflow.videoCampaignAuthorized !== true ||
  soulWorkflow.sitePreviewCampaignAuthorized !== true ||
  soulWorkflow.publicationRightsConfirmed !== true ||
  soulWorkflow.productionDeploymentPerformed !== false ||
  soulWorkflow.mainMergePerformed !== false ||
  soulWorkflow.signedInTrainingChargeConfirmed !== true
) {
  errors.push("generations.json: completed Soul workflow or downstream authorization is inconsistent");
}
if (
  soulExecutionCounts.uploadsPerformed !== 13 ||
  soulExecutionCounts.soulRunsSubmitted !== 1 ||
  soulExecutionCounts.soulsCreated !== 1 ||
  soulExecutionCounts.diagnosticsSubmitted !== 7 ||
  soulExecutionCounts.diagnosticsCompleted !== 7 ||
  soulExecutionCounts.trainingCreditsSpent !== 25 ||
  soulExecutionCounts.diagnosticCreditsSpent !== 0.84 ||
  soulExecutionCounts.grossCreditsSpent !== 25.84 ||
  soulExecutionCounts.concurrentProviderRewardGrantCredits !== 10
) {
  errors.push("generations.json: Soul execution counts or gross cost reconciliation is inconsistent");
}

const soulTrainingRuns = generationManifest.soulTrainingRuns ?? [];
const trainingRun = soulTrainingRuns[0] ?? {};
if (
  soulTrainingRuns.length !== 1 ||
  !stableSoulRunId.test(trainingRun.runId ?? "") ||
  trainingRun.assetId !== "CHR-SAGE-SOUL-001" ||
  trainingRun.provider !== "Higgsfield" ||
  trainingRun.selectedVariant !== "soul-cinematic" ||
  trainingRun.submissionCount !== 1 ||
  trainingRun.uploadedInputCount !== 13 ||
  trainingRun.acceptedInputCount !== 13 ||
  trainingRun.exactDuplicateCount !== 0 ||
  trainingRun.inputPolicy !== "ORIGINAL_SOURCE_FILES_UNCHANGED" ||
  !setsEqual(new Set(trainingRun.sourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  !setsEqual(new Set(trainingRun.excludedSourceAssetIds ?? []), new Set(["SRC-SAGE-014"])) ||
  !setsEqual(new Set(trainingRun.excludedAttemptIds ?? []), attemptIds) ||
  trainingRun.trainingCreditsSpent !== 25 ||
  trainingRun.privacyStatus !== "PRIVATE" ||
  trainingRun.reviewState !== "APPROVED"
) {
  errors.push("generations.json: expected one completed sanitized Soul training run");
}

const soulDiagnosticAttempts = generationManifest.soulDiagnosticAttempts ?? [];
let diagnosticGrossSpend = 0;
for (const [index, attempt] of soulDiagnosticAttempts.entries()) {
  const label = "Soul diagnostic " + attempt.attemptId;
  if (!stableSoulDiagnosticAttemptId.test(attempt.attemptId ?? "")) errors.push(label + ": unstable attempt ID");
  if (attempt.assetId !== "CHR-SAGE-SOUL-DIAG-001" || attempt.provider !== "Higgsfield" || attempt.model !== "Soul Cinema") {
    errors.push(label + ": unexpected provider, model, or asset");
  }
  if (attempt.viewKey !== expectedDiagnosticViewKeys[index]) errors.push(label + ": diagnostic view order mismatch");
  if (!setsEqual(new Set(attempt.authoritativeComparisonSourceIds ?? []), expectedSoulTrainingSourceIds)) {
    errors.push(label + ": originals must remain the authoritative comparison set");
  }
  if (attempt.grossCreditsSpent !== 0.12) errors.push(label + ": expected gross cost 0.12 credits");
  diagnosticGrossSpend += attempt.grossCreditsSpent ?? 0;
  const rejectedTattooFrame = index === 3;
  if (
    attempt.reviewState !== (rejectedTattooFrame ? "REJECTED" : "REVIEWED") ||
    attempt.eligibleForKeyframeIdentityReview !== !rejectedTattooFrame ||
    (rejectedTattooFrame && !(attempt.knownDefects ?? []).includes("INVENTED_TATTOOS")) ||
    attempt.privateEvaluationAsset !== true ||
    attempt.publicDeliveryAsset !== false
  ) {
    errors.push(label + ": review state or private evaluation boundary is incorrect");
  }
}
if (soulDiagnosticAttempts.length !== 7 || Math.abs(diagnosticGrossSpend - 0.84) > 1e-9) {
  errors.push("generations.json: expected seven Soul diagnostics with 0.84 gross credits spent");
}

const soulDiagnosticDecision = generationManifest.soulDiagnosticDecision ?? {};
if (
  soulDiagnosticDecision.decision !== "APPROVED FOR KEYFRAME DEVELOPMENT" ||
  !setsEqual(new Set(soulDiagnosticDecision.authoritativeIdentitySourceIds ?? []), expectedSoulTrainingSourceIds) ||
  soulDiagnosticDecision.candidate003Role !== "SECONDARY_COMPARISON_ONLY" ||
  !setsEqual(new Set(soulDiagnosticDecision.rejectedDiagnosticAttemptIds ?? []), new Set(["GEN-CHR-SAGE-SOUL-DIAG-001-004"])) ||
  !(soulDiagnosticDecision.frameLevelConstraints ?? []).includes("CHECK_FACE_LENGTH_AGAINST_ORIGINALS") ||
  !(soulDiagnosticDecision.frameLevelConstraints ?? []).includes("CHECK_EYE_OPENNESS_AND_AVOID_NARROWING_AGAINST_ORIGINALS") ||
  !(soulDiagnosticDecision.frameLevelConstraints ?? []).includes("NO_INVENTED_TATTOOS") ||
  soulDiagnosticDecision.keyframeCampaignAuthorized !== true ||
  soulDiagnosticDecision.videoCampaignAuthorized !== true ||
  soulDiagnosticDecision.sitePreviewCampaignAuthorized !== true ||
  soulDiagnosticDecision.productionDeploymentPerformed !== false ||
  soulDiagnosticDecision.mainMergePerformed !== false
) {
  errors.push("generations.json: Soul diagnostic decision or downstream gate is inconsistent");
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
      historicalOpenAIDiagnosticSources: historicalOpenAISourceIds.size,
      executedUnchangedSoulSources: executedSoulSourceIds.size,
      assets: assetIds.size,
      keyframes: keyframeKeys.size,
      generationAttempts: generationManifest.attempts.length,
      openAIProviderSubmissions: generationManifest.openAIProviderSubmissionsPerformed,
      higgsfieldUploadsPerformed: generationManifest.higgsfieldUploadsPerformed,
      soulRunsSubmitted: soulExecutionCounts.soulRunsSubmitted,
      soulsCreated: soulExecutionCounts.soulsCreated,
      soulDiagnosticOutputs: soulExecutionCounts.diagnosticsCompleted,
      productionAssetUploadsPerformed: generationManifest.productionAssetUploadsPerformed,
      selectedKeyframes: keyframeWorkflow.selectedKeyframeCount,
      successfulMotionSegments: motionWorkflow.successfulSegmentCount,
      refundedMotionAttempts: motionWorkflow.failedRefundedAttemptCount,
      verifiedProtectedPreviewDeliveryAssets: generationManifest.verifiedProtectedPreviewDeliveryAssets,
      deliveryVerificationResult: motionAssembly.verificationResult,
      grossHiggsfieldCreditsCharged: generationManifest.grossHiggsfieldCreditsCharged,
      grossHiggsfieldCreditsSpent: generationManifest.grossHiggsfieldCreditsSpent,
      higgsfieldCreditsRefunded: generationManifest.higgsfieldCreditsRefunded,
      concurrentProviderRewardGrantCredits: soulExecutionCounts.concurrentProviderRewardGrantCredits,
      diagnosticDecision: soulDiagnosticDecision.decision,
      keyframeCampaignAuthorized: soulDiagnosticDecision.keyframeCampaignAuthorized,
      productionDeploymentPerformed: soulDiagnosticDecision.productionDeploymentPerformed,
      textOnly: true,
    },
    null,
    2,
  ),
);
