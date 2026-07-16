import rawManifest from "@/content/runway-resort-media.json";

export type CinematicViewport = "desktop" | "mobile";

export type PublicMediaAsset = {
  src: string;
  bytes: number;
  sha256: string;
  codec: string;
};

export type CinematicMediaFamily = {
  width: number;
  height: number;
  durationSeconds: number | null;
  frameRate: number | null;
  sourceVersion: string | null;
  poster: PublicMediaAsset | null;
  webm: PublicMediaAsset | null;
  mp4: PublicMediaAsset | null;
};

export type RunwayResortMediaManifest = {
  schemaVersion: "1.0.0";
  version: string;
  posterEnabled: boolean;
  enabled: boolean;
  scrollLengthVh: number;
  review: {
    state: "not-ready" | "internal-qa-approved" | "client-approved";
    publicationScope: "protected-preview-only" | "production";
    authorizationRecord: string;
  };
  rightsScope: "project-saite-commercial-web";
  deliveryBudgets: {
    posterMaxBytes: number;
    videoMaxBytes: number;
  };
  beats: Array<{ key: string; start: number; end: number }>;
  desktop: CinematicMediaFamily;
  mobile: CinematicMediaFamily;
};

function isAssetReady(asset: PublicMediaAsset | null): asset is PublicMediaAsset {
  return Boolean(asset?.src && asset.bytes > 0 && /^[a-f0-9]{64}$/i.test(asset.sha256));
}

function isFamilyReady(family: CinematicMediaFamily) {
  return (
    isAssetReady(family.poster) &&
    isAssetReady(family.webm) &&
    isAssetReady(family.mp4) &&
    typeof family.durationSeconds === "number" &&
    family.durationSeconds > 0
  );
}

function isPosterFamilyReady(family: CinematicMediaFamily) {
  return isAssetReady(family.poster) && Boolean(family.sourceVersion);
}

export const runwayResortMedia = rawManifest as RunwayResortMediaManifest;

export function isCinematicPosterReady() {
  return (
    runwayResortMedia.posterEnabled &&
    isPosterFamilyReady(runwayResortMedia.desktop) &&
    isPosterFamilyReady(runwayResortMedia.mobile)
  );
}

export function isCinematicMediaReady() {
  return (
    runwayResortMedia.enabled &&
    isCinematicPosterReady() &&
    isFamilyReady(runwayResortMedia.desktop) &&
    isFamilyReady(runwayResortMedia.mobile)
  );
}

export function getCinematicFamily(viewport: CinematicViewport) {
  return runwayResortMedia[viewport];
}
