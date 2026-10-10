import type { Metadata } from "next";
import { openGraphShareImage, twitterShareImage } from "@/lib/social-metadata";
import { siteUrl } from "@/lib/site-url";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: "website", title: `${title} | Sage Burress`, description, url: `${siteUrl}${path}`, siteName: "Sage Burress", images: [openGraphShareImage] },
    twitter: { card: "summary", title: `${title} | Sage Burress`, description, images: [twitterShareImage] },
  };
}
