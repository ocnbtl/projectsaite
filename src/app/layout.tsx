import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sageburress.com"),
  title: {
    default: "Sage Burress | Model, Creator, Scout & Artist",
    template: "%s | Sage Burress",
  },
  description:
    "Sage Burress is a model, content creator, model scout, face painter, and hospitality creative partner.",
  openGraph: {
    type: "website",
    siteName: "Sage Burress",
    title: "Sage Burress | Model, Creator, Scout & Artist",
    description: "Creative work, thoughtful partnerships, and bookings with Sage Burress.",
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
