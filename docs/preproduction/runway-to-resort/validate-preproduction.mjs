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

const assetsManifest = readJson("manifests/assets.json");
const keyframeManifest = readJson("manifests/keyframes.json");
const generationManifest = readJson("manifests/generations.json");

if (assetsManifest.schemaVersion !== "1.0.0") errors.push("assets.json: unexpected schemaVersion");
if (keyframeManifest.schemaVersion !== "1.0.0") errors.push("keyframes.json: unexpected schemaVersion");
if (generationManifest.schemaVersion !== "1.0.0") errors.push("generations.json: unexpected schemaVersion");

const assetIds = new Set();
const keyframeKeys = new Set();

for (const source of assetsManifest.requiredSources ?? []) {
  if (!allowedSourceStates.has(source.sourceStatus)) {
    errors.push("required source " + source.slot + ": invalid sourceStatus");
  }
  if (source.sourceStatus === "APPROVED_SOURCE") {
    errors.push("required source " + source.slot + ": cannot be approved while no source file is present");
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

if (generationManifest.generationAuthorized !== false) {
  errors.push("generations.json: generation must remain unauthorized in this phase");
}
if (generationManifest.uploadsPerformed !== 0 || generationManifest.creditsSpent !== 0) {
  errors.push("generations.json: uploads and credits must remain zero");
}
if (!Array.isArray(generationManifest.attempts) || generationManifest.attempts.length !== 0) {
  errors.push("generations.json: attempt log must remain empty before authorization");
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
      assets: assetIds.size,
      keyframes: keyframeKeys.size,
      generationAttempts: generationManifest.attempts.length,
      uploadsPerformed: generationManifest.uploadsPerformed,
      creditsSpent: generationManifest.creditsSpent,
      textOnly: true,
    },
    null,
    2,
  ),
);
