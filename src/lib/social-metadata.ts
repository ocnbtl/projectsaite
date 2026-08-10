import { siteUrl } from "@/lib/site-url";

export const socialShareImageAlt = "Sage Burress SB monogram";

const socialShareImageVersion = "sb-monogram-v2";

export const openGraphShareImage = {
  url: `${siteUrl}/opengraph-image?v=${socialShareImageVersion}`,
  secureUrl: `${siteUrl}/opengraph-image?v=${socialShareImageVersion}`,
  type: "image/png",
  width: 1200,
  height: 630,
  alt: socialShareImageAlt,
};

export const twitterShareImage = {
  url: `${siteUrl}/twitter-image?v=${socialShareImageVersion}`,
  secureUrl: `${siteUrl}/twitter-image?v=${socialShareImageVersion}`,
  type: "image/png",
  width: 1200,
  height: 630,
  alt: socialShareImageAlt,
};
