export const CONTENT_IMAGE_HOSTNAMES = ["images.unsplash.com"] as const;

export function isAllowedContentImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && CONTENT_IMAGE_HOSTNAMES.some((hostname) => url.hostname === hostname);
  } catch {
    return false;
  }
}
