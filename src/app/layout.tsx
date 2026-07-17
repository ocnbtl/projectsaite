import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";

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
    "Portfolio and bookings for Sage Burress: modeling, face painting, content creation, and travel collaborations.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sage Burress",
    title: "Sage Burress | Model & Creative",
    description: "Selected work and bookings with Sage Burress.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
