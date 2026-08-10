import { createSocialShareImage } from "@/lib/social-share-image";

export const alt = "Sage Burress SB monogram";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
  return createSocialShareImage();
}
