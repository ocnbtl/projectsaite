import type { Metadata } from "next";
import { VercelAnalytics } from "@/components/site/vercel-analytics";
import { PrivacyRegionProvider } from "@/components/site/privacy-region";
import { requestPrivacyRegion } from "@/lib/privacy-region";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";

import { openGraphShareImage, twitterShareImage } from "@/lib/social-metadata";
import { siteUrl } from "@/lib/site-url";

import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sage Burress | Model & Creative",
    template: "%s | Sage Burress",
  },
  description:
    "Portfolio and bookings for Sage Burress: modeling, content creation, makeup artistry, travel promotions, henna, and face painting.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    locale: "en_US",
    siteName: "Sage Burress",
    title: "Sage Burress | Model & Creative",
    description: "Selected work and bookings with Sage Burress.",
    images: [openGraphShareImage],
  },
  twitter: {
    card: "summary",
    title: "Sage Burress | Model & Creative",
    description: "Selected work and bookings with Sage Burress.",
    images: [twitterShareImage],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const policy = await requestPrivacyRegion();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        <PrivacyRegionProvider policy={policy}>
          {children}
          <VercelAnalytics environment={process.env.VERCEL_ENV ?? "local"} />
        </PrivacyRegionProvider>
      </body>
    </html>
  );
}
