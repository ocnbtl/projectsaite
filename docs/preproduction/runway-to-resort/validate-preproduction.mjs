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
const plannedSoulSourceIds = new Set(
  (sourcesManifest.sources ?? [])
    .filter((source) => source.selectedForFirstSoulTraining)
    .map((source) => source.id),
);
if (sourceIds.size !== 14) errors.push("sources.json: expected exactly 14 source records");
if (!setsEqual(historicalOpenAISourceIds, expectedOpenAIDiagnosticSourceIds)) {
  errors.push("sources.json: selected identity source set does not match the reviewed five-source subset");
}
if (!setsEqual(plannedSoulSourceIds, expectedSoulTrainingSourceIds)) {
  errors.push("sources.json: planned Soul set must contain exactly the thirteen original photographs");
}
for (const source of sourcesManifest.sources ?? []) {
  const label = "source " + source.id;
  if (expectedSoulTrainingSourceIds.has(source.id)) {
    if (
      source.kind !== "original_photo" ||
      source.sourceStatus !== "HASHED" ||
      source.duplicateOf !== null ||
      source.selectedForFirstSoulTraining !== true ||
      source.soulTrainingInputMode !== "ORIGINAL_FILE_UNCHANGED" ||
      source.ownerHiggsfieldAuthorization !== "AUTHORIZED_ONE_PRIVATE_SOUL_RUN" ||
      source.providerComplianceState !== "BLOCKED_BEFORE_UPLOAD" ||
      source.copyrightLicenseStatus !== "UNKNOWN" ||
      source.commercialWebsitePermission !== "UNKNOWN" ||
      !String(source.higgsfieldUploadPermission ?? "").startsWith("OWNER_AUTHORIZED_ONE_PRIVATE_SOUL_RUN_PROVIDER_SUBMISSION_BLOCKED") ||
      !(source.restrictions ?? []).includes("OWNER_POLICY_ALLOWS_BRANDING_IN_PRIVATE_SOUL_INPUT_PROVIDER_ACCEPTANCE_UNVERIFIED") ||
      !(source.restrictions ?? []).includes("NO_OUTPUT_BRAND_REPRODUCTION")
    ) {
      errors.push(label + ": invalid unchanged-original Soul authorization or rights state");
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
  sourceSummary.selectedOriginalInputsForPlannedSoul !== plannedSoulSourceIds.size ||
  sourceSummary.excludedInputsForPlannedSoul !== 1 ||
  sourceSummary.trueProfileViewsAvailable !== 0
) {
  errors.push("sources.json: summary does not match the reviewed intake totals");
}
const plannedSoulInputSet = sourcesManifest.plannedSoulInputSet ?? {};
if (
  plannedSoulInputSet.state !== "BLOCKED_BEFORE_UPLOAD" ||
  plannedSoulInputSet.selectionMode !== "ORIGINAL_FILE_UNCHANGED" ||
  !setsEqual(new Set(plannedSoulInputSet.selectedSourceIds ?? []), expectedSoulTrainingSourceIds) ||
  !setsEqual(new Set(plannedSoulInputSet.excludedSourceIds ?? []), new Set(["SRC-SAGE-014"])) ||
  plannedSoulInputSet.generatedDerivativesAllowed !== false ||
  plannedSoulInputSet.historicalFirstIdentityBatchSelectionPreserved !== true ||
  plannedSoulInputSet.rightsStatus !== "RIGHTS_UNKNOWN" ||
  plannedSoulInputSet.commercialWebsitePermission !== "UNKNOWN" ||
  plannedSoulInputSet.uploadState !== "NOT_UPLOADED" ||
  plannedSoulInputSet.ownerHiggsfieldAuthorization !== "AUTHORIZED_ONE_PRIVATE_SOUL_RUN" ||
  plannedSoulInputSet.providerComplianceState !== "BLOCKED_BEFORE_UPLOAD" ||
  plannedSoulInputSet.inputBrandingPolicy !== "OWNER_POLICY_ALLOWS_BRANDING_IN_PRIVATE_SOUL_INPUT_PROVIDER_ACCEPTANCE_UNVERIFIED" ||
  plannedSoulInputSet.outputBrandingPolicy !== "PROHIBITED" ||
  plannedSoulInputSet.authenticatedUiState !== "UNAVAILABLE" ||
  plannedSoulInputSet.operationalEvidence?.version !== "0.12.0" ||
  plannedSoulInputSet.operationalEvidence?.minimumInputCount !== 5 ||
  plannedSoulInputSet.operationalEvidence?.maximumInputCount !== 20 ||
  plannedSoulInputSet.operationalEvidence?.sweetSpotInputCount !== "8_TO_12" ||
  !setsEqual(new Set(plannedSoulInputSet.operationalEvidence?.acceptedFormats ?? []), new Set(["JPEG", "PNG"])) ||
  plannedSoulInputSet.operationalEvidence?.idealMinimumDimensionsPixels !== "1024x1024" ||
  plannedSoulInputSet.operationalEvidence?.paidBasicOrHigherPlanRequired !== true ||
  plannedSoulInputSet.operationalEvidence?.selectedVariant !== "soul-cinematic" ||
  plannedSoulInputSet.marketingAndPublicUiEvidence?.recommendedInputCount !== "20_OR_MORE" ||
  plannedSoulInputSet.marketingAndPublicUiEvidence?.maximumInputCount !== 80 ||
  plannedSoulInputSet.marketingAndPublicUiEvidence?.optimalMinimumResolutionPixels !== 960 ||
  plannedSoulInputSet.marketingAndPublicUiEvidence?.displayedReferenceCostCredits !== 25 ||
  plannedSoulInputSet.marketingAndPublicUiEvidence?.signedInChargeConfirmed !== false ||
  plannedSoulInputSet.operationalEligibility?.selectedInputCount !== 13 ||
  plannedSoulInputSet.operationalEligibility?.countWithinPublishedOperationalRange !== true ||
  plannedSoulInputSet.operationalEligibility?.allSelectedInputsUseAcceptedFormats !== true ||
  plannedSoulInputSet.operationalEligibility?.allSelectedInputsMeetIdealDimensions !== true ||
  plannedSoulInputSet.operationalEligibility?.noAdditionalPhotosRequiredByPublishedOperationalCount !== true ||
  plannedSoulInputSet.operationalEligibility?.exactThirteenFileAcceptance !== "UNKNOWN_UNTIL_AUTHENTICATED_PREFLIGHT" ||
  plannedSoulInputSet.selectedVariant !== "soul-cinematic"
) {
  errors.push("sources.json: planned Soul input contract is inconsistent or overbroad");
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

const plannedSoulAsset = assetRecords.get("CHR-SAGE-SOUL-001") ?? {};
if (
  plannedSoulAsset.provider !== "Higgsfield" ||
  plannedSoulAsset.model !== "Soul ID — cinematic variant" ||
  plannedSoulAsset.workflow !== "ONE_PRIVATE_SOUL_CINEMATIC_TRAINING_RUN" ||
  plannedSoulAsset.promptSpecPath !== "prompts/character/soul-diagnostic.md#training-contract" ||
  !setsEqual(new Set(plannedSoulAsset.sourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  plannedSoulAsset.rightsStatus !== "RIGHTS_UNKNOWN" ||
  plannedSoulAsset.privacyStatus !== "REQUIRED_BUT_NOT_VERIFIED" ||
  plannedSoulAsset.provenanceStatus !== "PLANNED_BLOCKED_BEFORE_UPLOAD" ||
  plannedSoulAsset.reviewState !== "PROPOSED" ||
  plannedSoulAsset.settings?.authorizedPrivateRunCount !== 1 ||
  plannedSoulAsset.settings?.selectedOriginalInputCount !== 13 ||
  plannedSoulAsset.settings?.inputPolicy !== "ORIGINAL_SOURCE_FILES_UNCHANGED" ||
  plannedSoulAsset.settings?.uploadedInputCount !== 0 ||
  plannedSoulAsset.settings?.submittedRunCount !== 0 ||
  plannedSoulAsset.settings?.createdSoulCount !== 0 ||
  plannedSoulAsset.settings?.creditsSpent !== 0 ||
  plannedSoulAsset.settings?.generatedCandidatesEligibleAsInputs !== false ||
  plannedSoulAsset.settings?.operationalEvidence?.version !== "0.12.0" ||
  plannedSoulAsset.settings?.operationalEvidence?.minimumInputCount !== 5 ||
  plannedSoulAsset.settings?.operationalEvidence?.maximumInputCount !== 20 ||
  plannedSoulAsset.settings?.operationalEvidence?.paidBasicOrHigherPlanRequired !== true ||
  plannedSoulAsset.settings?.operationalEvidence?.selectedVariant !== "soul-cinematic" ||
  plannedSoulAsset.settings?.operationalEligibility?.countWithinPublishedOperationalRange !== true ||
  plannedSoulAsset.settings?.operationalEligibility?.allSelectedInputsUseAcceptedFormats !== true ||
  plannedSoulAsset.settings?.operationalEligibility?.allSelectedInputsMeetIdealDimensions !== true ||
  plannedSoulAsset.settings?.operationalEligibility?.noAdditionalPhotosRequiredByPublishedOperationalCount !== true ||
  plannedSoulAsset.settings?.operationalEligibility?.exactThirteenFileAcceptance !== "UNKNOWN_UNTIL_AUTHENTICATED_PREFLIGHT" ||
  plannedSoulAsset.settings?.marketingAndPublicUiEvidence?.displayedReferenceCostCredits !== 25 ||
  plannedSoulAsset.settings?.marketingAndPublicUiEvidence?.signedInChargeConfirmed !== false ||
  plannedSoulAsset.settings?.accountPlanStatus !== "UNKNOWN" ||
  plannedSoulAsset.settings?.inputBrandingPolicy !== "OWNER_POLICY_ALLOWS_BRANDING_IN_PRIVATE_SOUL_INPUT_PROVIDER_ACCEPTANCE_UNVERIFIED"
) {
  errors.push("assets.json: planned Soul asset is missing the bounded blocked-before-upload contract");
}

const plannedSoulDiagnosticAsset = assetRecords.get("CHR-SAGE-SOUL-DIAG-001") ?? {};
if (
  plannedSoulDiagnosticAsset.provider !== "Higgsfield" ||
  plannedSoulDiagnosticAsset.model !== "Soul Cinema" ||
  plannedSoulDiagnosticAsset.workflow !== "PRIVATE_SOUL_CINEMA_IDENTITY_DIAGNOSTICS" ||
  plannedSoulDiagnosticAsset.promptSpecPath !== "prompts/character/soul-diagnostic.md#diagnostic-output-contract" ||
  !setsEqual(new Set(plannedSoulDiagnosticAsset.sourceAssetIds ?? []), expectedSoulTrainingSourceIds) ||
  !setsEqual(new Set(plannedSoulDiagnosticAsset.continuityDependencies ?? []), new Set(["CHR-SAGE-SOUL-001"])) ||
  plannedSoulDiagnosticAsset.rightsStatus !== "RIGHTS_UNKNOWN" ||
  plannedSoulDiagnosticAsset.privacyStatus !== "REQUIRED_BUT_NOT_VERIFIED" ||
  plannedSoulDiagnosticAsset.reviewState !== "PROPOSED" ||
  plannedSoulDiagnosticAsset.settings?.authorizedMaximumDiagnostics !== 7 ||
  plannedSoulDiagnosticAsset.settings?.submittedDiagnostics !== 0 ||
  plannedSoulDiagnosticAsset.settings?.completedDiagnostics !== 0 ||
  plannedSoulDiagnosticAsset.settings?.creditsSpent !== 0 ||
  !setsEqual(new Set(plannedSoulDiagnosticAsset.settings?.orderedDiagnosticViewKeys ?? []), new Set(expectedDiagnosticViewKeys)) ||
  !setsEqual(new Set(plannedSoulDiagnosticAsset.settings?.allowedDecisionValues ?? []), new Set(allowedSoulDecisionValues)) ||
  plannedSoulDiagnosticAsset.settings?.keyframeCampaignAuthorized !== false ||
  plannedSoulDiagnosticAsset.settings?.videoCampaignAuthorized !== false ||
  plannedSoulDiagnosticAsset.settings?.publicationAuthorized !== false ||
  plannedSoulDiagnosticAsset.settings?.productionMutationAuthorized !== false ||
  plannedSoulDiagnosticAsset.settings?.inputBrandingPolicy !== "OWNER_POLICY_ALLOWS_BRANDING_IN_PRIVATE_SOUL_INPUT_PROVIDER_ACCEPTANCE_UNVERIFIED"
) {
  errors.push("assets.json: planned Soul diagnostic asset is missing the exact seven-view blocked gate");
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
const attemptRecords = new Map();
for (const attempt of generationManifest.attempts ?? []) {
  const label = "attempt " + attempt.attemptId;
  if (!stableAttemptId.test(attempt.attemptId ?? "")) errors.push(label + ": unstable attempt ID");
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
const soulOperationalEvidence = soulWorkflow.operationalSkillEvidence ?? {};
const soulMarketingEvidence = soulWorkflow.marketingAndPublicUiEvidence ?? {};
const soulOperationalEligibility = soulWorkflow.operationalEligibility ?? {};
const unresolvedSoulFacts = soulWorkflow.unresolvedPreflightFacts ?? {};
const soulExecutionCounts = soulWorkflow.executionCounts ?? {};
if (
  soulWorkflow.authorizationScope !== "ONE_PRIVATE_SOUL_RUN_AND_MAXIMUM_SEVEN_PRIVATE_DIAGNOSTICS" ||
  soulWorkflow.preflightState !== "BLOCKED_BEFORE_UPLOAD" ||
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
  soulWorkflow.authenticatedUiState !== "UNAVAILABLE" ||
  soulWorkflow.privacyState !== "REQUIRED_BUT_NOT_VERIFIED" ||
  JSON.stringify(soulWorkflow.orderedDiagnosticViewKeys ?? []) !== JSON.stringify(expectedDiagnosticViewKeys) ||
  !setsEqual(new Set(soulWorkflow.allowedDecisionValues ?? []), new Set(allowedSoulDecisionValues)) ||
  soulWorkflow.keyframeCampaignAuthorized !== false ||
  soulWorkflow.videoCampaignAuthorized !== false ||
  soulWorkflow.publicationAuthorized !== false ||
  soulWorkflow.productionMutationAuthorized !== false ||
  soulWorkflow.inputBrandingPolicy !== "OWNER_POLICY_ALLOWS_BRANDING_IN_PRIVATE_SOUL_INPUT_PROVIDER_ACCEPTANCE_UNVERIFIED" ||
  soulWorkflow.outputBrandingPolicy !== "PROHIBITED" ||
  soulWorkflow.publicDisplayedCostCredits !== 25 ||
  soulWorkflow.signedInChargeConfirmed !== false ||
  soulWorkflow.noAdditionalPhotosRequiredByPublishedOperationalCount !== true
) {
  errors.push("generations.json: Soul authorization exceeds or contradicts the bounded owner instruction");
}
if (
  soulOperationalEvidence.version !== "0.12.0" ||
  soulOperationalEvidence.minimumInputCount !== 5 ||
  soulOperationalEvidence.maximumInputCount !== 20 ||
  soulOperationalEvidence.sweetSpotInputCount !== "8_TO_12" ||
  !setsEqual(new Set(soulOperationalEvidence.acceptedFormats ?? []), new Set(["JPEG", "PNG"])) ||
  soulOperationalEvidence.idealMinimumDimensionsPixels !== "1024x1024" ||
  soulOperationalEvidence.trainingFailureThreshold !== "FIVE_OR_MORE_UNIQUE_FACES" ||
  soulOperationalEvidence.paidBasicOrHigherPlanRequired !== true ||
  soulOperationalEvidence.selectedVariant !== "soul-cinematic" ||
  soulMarketingEvidence.recommendedInputCount !== "20_OR_MORE" ||
  soulMarketingEvidence.maximumInputCount !== 80 ||
  soulMarketingEvidence.optimalMinimumResolutionPixels !== 960 ||
  soulMarketingEvidence.displayedReferenceCostCredits !== 25 ||
  soulMarketingEvidence.signedInChargeConfirmed !== false ||
  soulOperationalEligibility.selectedInputCount !== 13 ||
  soulOperationalEligibility.countWithinPublishedOperationalRange !== true ||
  soulOperationalEligibility.allSelectedInputsUseAcceptedFormats !== true ||
  soulOperationalEligibility.allSelectedInputsMeetIdealDimensions !== true ||
  soulOperationalEligibility.noAdditionalPhotosRequiredByPublishedOperationalCount !== true ||
  unresolvedSoulFacts.exactThirteenFileAcceptance !== "UNKNOWN" ||
  unresolvedSoulFacts.exactSignedInCostOrPlan !== "UNKNOWN" ||
  unresolvedSoulFacts.accountPlanStatus !== "UNKNOWN" ||
  unresolvedSoulFacts.accountCreditBalance !== "UNKNOWN" ||
  unresolvedSoulFacts.privacyTermsAcceptance !== "UNKNOWN" ||
  unresolvedSoulFacts.providerPolicyAcceptance !== "UNKNOWN" ||
  unresolvedSoulFacts.authenticationState !== "AUTHENTICATED_UI_UNAVAILABLE"
) {
  errors.push("generations.json: public Soul guidance or unresolved signed-in facts are misstated");
}
const requiredSoulBlockers = [
  "SOURCE_COPYRIGHT_AND_LICENSE_UNRESOLVED",
  "PROVIDER_POLICY_AND_PRIVACY_ACCEPTANCE_REQUIRED",
  "PROVIDER_AUTHENTICATION_REQUIRED",
  "EXACT_THIRTEEN_FILE_ACCEPTANCE_UNKNOWN",
  "EXACT_SIGNED_IN_COST_PLAN_AND_BALANCE_UNKNOWN",
];
if (requiredSoulBlockers.some((blocker) => !(soulWorkflow.blockers ?? []).includes(blocker))) {
  errors.push("generations.json: required provider, rights, privacy, or account blocker is missing");
}
if (
  soulExecutionCounts.uploadsPerformed !== 0 ||
  soulExecutionCounts.soulRunsSubmitted !== 0 ||
  soulExecutionCounts.soulsCreated !== 0 ||
  soulExecutionCounts.diagnosticsSubmitted !== 0 ||
  soulExecutionCounts.diagnosticsCompleted !== 0 ||
  soulExecutionCounts.creditsSpent !== 0 ||
  !Array.isArray(generationManifest.soulTrainingRuns) ||
  generationManifest.soulTrainingRuns.length !== 0 ||
  !Array.isArray(generationManifest.soulDiagnosticAttempts) ||
  generationManifest.soulDiagnosticAttempts.length !== 0
) {
  errors.push("generations.json: blocked preflight must have zero Soul execution, outputs, and spend");
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
      plannedUnchangedSoulSources: plannedSoulSourceIds.size,
      assets: assetIds.size,
      keyframes: keyframeKeys.size,
      generationAttempts: generationManifest.attempts.length,
      openAIProviderSubmissions: generationManifest.providerSubmissionsPerformed,
      higgsfieldUploadsPerformed: generationManifest.higgsfieldUploadsPerformed,
      soulRunsSubmitted: soulExecutionCounts.soulRunsSubmitted,
      soulsCreated: soulExecutionCounts.soulsCreated,
      soulDiagnosticOutputs: soulExecutionCounts.diagnosticsCompleted,
      productionAssetUploadsPerformed: generationManifest.productionAssetUploadsPerformed,
      creditsSpent: generationManifest.creditsSpent + soulExecutionCounts.creditsSpent,
      textOnly: true,
    },
    null,
    2,
  ),
);
