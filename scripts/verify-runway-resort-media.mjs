import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const manifestPath = join(root, "src/content/runway-resort-media.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const errors = [];

if (manifest.schemaVersion !== "1.0.0") errors.push("unexpected schemaVersion");
if (!/^v\d+$/.test(manifest.version ?? "")) errors.push("version must use v# format");
if (!Number.isFinite(manifest.scrollLengthVh) || manifest.scrollLengthVh < 100) {
  errors.push("scrollLengthVh must be at least 100");
}
if (manifest.rightsScope !== "project-saite-commercial-web") errors.push("unexpected rightsScope");
if (!manifest.review?.authorizationRecord) errors.push("missing sanitized authorization record");
if (manifest.review?.publicationScope !== "protected-preview-only" && manifest.review?.publicationScope !== "production") {
  errors.push("unexpected publicationScope");
}
if (!Number.isInteger(manifest.deliveryBudgets?.posterMaxBytes) || manifest.deliveryBudgets.posterMaxBytes <= 0) {
  errors.push("posterMaxBytes must be a positive integer");
}
if (!Number.isInteger(manifest.deliveryBudgets?.videoMaxBytes) || manifest.deliveryBudgets.videoMaxBytes <= 0) {
  errors.push("videoMaxBytes must be a positive integer");
}

const expectedBeats = [
  ["runway-dormant", 0, 15],
  ["runway-ignition", 15, 45],
  ["lens-occlusion", 45, 58],
  ["resort-light-leak", 58, 64],
  ["resort-reveal", 64, 88],
  ["resort-resolve", 88, 100],
];
if (JSON.stringify(manifest.beats) !== JSON.stringify(expectedBeats.map(([key, start, end]) => ({ key, start, end })))) {
  errors.push("beat ranges do not match the approved timeline");
}

const expectedFamilies = {
  desktop: { width: 1920, height: 1080, ratio: 16 / 9 },
  mobile: { width: 1080, height: 1920, ratio: 9 / 16 },
};
const expectedCodecs = { poster: "webp", webm: "vp9", mp4: "h264" };

function parseRate(value) {
  if (typeof value !== "string") return NaN;
  const [numerator, denominator = "1"] = value.split("/").map(Number);
  return denominator ? numerator / denominator : NaN;
}

function inspectMedia(path, label) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "stream=codec_name,width,height,avg_frame_rate:format=duration",
      "-of",
      "json",
      path,
    ],
    { encoding: "utf8" },
  );
  if (result.error || result.status !== 0) {
    errors.push(`${label}: ffprobe could not inspect the file`);
    return null;
  }
  try {
    const data = JSON.parse(result.stdout);
    const stream = data.streams?.[0];
    if (!stream) throw new Error("missing stream");
    return {
      codec: stream.codec_name,
      width: stream.width,
      height: stream.height,
      frameRate: parseRate(stream.avg_frame_rate),
      durationSeconds: Number(data.format?.duration),
    };
  } catch {
    errors.push(`${label}: ffprobe returned invalid metadata`);
    return null;
  }
}

let checkedAssets = 0;

function validateAsset(familyName, family, kind, extension) {
  const asset = family[kind];
  const label = `${familyName}.${kind}`;
  if (
    !asset?.src ||
    !Number.isInteger(asset.bytes) ||
    asset.bytes <= 0 ||
    !/^[a-f0-9]{64}$/i.test(asset.sha256 ?? "") ||
    asset.codec !== expectedCodecs[kind]
  ) {
    errors.push(`${label}: missing or invalid path, byte count, SHA-256, or codec`);
    return;
  }
  if (!asset.src.startsWith(`/media/runway-to-resort/${manifest.version}/`)) {
    errors.push(`${label}: path is outside the versioned delivery namespace`);
  }
  if (extname(asset.src) !== extension) errors.push(`${label}: expected ${extension}`);
  const path = join(root, "public", asset.src.replace(/^\//, ""));
  if (!existsSync(path)) {
    errors.push(`${label}: file does not exist`);
    return;
  }
  const size = statSync(path).size;
  const maxBytes = kind === "poster" ? manifest.deliveryBudgets.posterMaxBytes : manifest.deliveryBudgets.videoMaxBytes;
  if (size > maxBytes) errors.push(`${label}: exceeds the delivery byte budget`);
  const bytes = readFileSync(path);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (size !== asset.bytes) errors.push(`${label}: byte count mismatch`);
  if (digest !== asset.sha256) errors.push(`${label}: SHA-256 mismatch`);

  const inspected = inspectMedia(path, label);
  if (inspected) {
    if (inspected.codec !== asset.codec) errors.push(`${label}: actual codec does not match manifest`);
    if (inspected.width !== family.width || inspected.height !== family.height) {
      errors.push(`${label}: actual dimensions do not match manifest`);
    }
    if (kind !== "poster") {
      if (!Number.isFinite(inspected.durationSeconds) || Math.abs(inspected.durationSeconds - family.durationSeconds) > 0.2) {
        errors.push(`${label}: actual duration does not match manifest`);
      }
      if (!Number.isFinite(inspected.frameRate) || Math.abs(inspected.frameRate - family.frameRate) > 0.1) {
        errors.push(`${label}: actual frame rate does not match manifest`);
      }
    }
  }
  checkedAssets += 1;
}

if (typeof manifest.posterEnabled !== "boolean") errors.push("posterEnabled must be boolean");
if (manifest.enabled && !manifest.posterEnabled) errors.push("cinematic motion cannot be enabled without approved posters");

for (const [familyName, expected] of Object.entries(expectedFamilies)) {
  const family = manifest[familyName];
  if (!family || family.width !== expected.width || family.height !== expected.height) {
    errors.push(`${familyName}: unexpected delivery dimensions`);
    continue;
  }
  if (Math.abs(family.width / family.height - expected.ratio) > 0.001) {
    errors.push(`${familyName}: unexpected aspect ratio`);
  }
  if (!manifest.posterEnabled) {
    if (
      family.poster ||
      family.webm ||
      family.mp4 ||
      family.durationSeconds != null ||
      family.frameRate != null ||
      family.sourceVersion != null
    ) {
      errors.push(`${familyName}: fallback-only manifest must not reference partial delivery assets`);
    }
    continue;
  }
  if (!/^[A-Z0-9-]+-v\d+$/.test(family.sourceVersion ?? "")) {
    errors.push(`${familyName}: sourceVersion must be a sanitized stable version`);
  }
  validateAsset(familyName, family, "poster", ".webp");

  if (!manifest.enabled) {
    if (family.webm || family.mp4 || family.durationSeconds != null || family.frameRate != null) {
      errors.push(`${familyName}: poster-only state must not reference motion assets`);
    }
    continue;
  }
  if (!(Number.isFinite(family.durationSeconds) && family.durationSeconds > 0)) {
    errors.push(`${familyName}: durationSeconds must be positive when enabled`);
  }
  if (!(Number.isFinite(family.frameRate) && family.frameRate >= 23.9 && family.frameRate <= 30)) {
    errors.push(`${familyName}: frameRate must be between 23.9 and 30 when enabled`);
  }
  validateAsset(familyName, family, "webm", ".webm");
  validateAsset(familyName, family, "mp4", ".mp4");
}

if (!manifest.posterEnabled && manifest.review?.state !== "not-ready") {
  errors.push("fallback-only manifest review state must be not-ready");
}
if (manifest.posterEnabled && !["internal-qa-approved", "client-approved"].includes(manifest.review?.state)) {
  errors.push("poster or cinematic delivery requires an approved review state");
}

if (errors.length) {
  console.error("Runway-to-Resort media verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      posterEnabled: manifest.posterEnabled,
      enabled: manifest.enabled,
      version: manifest.version,
      beats: manifest.beats.length,
      checkedAssets,
      state: manifest.enabled
        ? "DELIVERY_ASSETS_VERIFIED"
        : manifest.posterEnabled
          ? "POSTERS_VERIFIED"
          : "SAFE_FALLBACK_ONLY",
    },
    null,
    2,
  ),
);
