const productionSiteUrl = "https://sageburress.com";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteUrl = configuredSiteUrl === "https://projectsaite-theta.vercel.app"
  ? productionSiteUrl
  : configuredSiteUrl ?? productionSiteUrl;
