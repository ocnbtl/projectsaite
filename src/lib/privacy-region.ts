import "server-only";
import { headers } from "next/headers";
import { privacyRegion } from "./analytics-policy";

export async function requestPrivacyRegion() {
  const request = await headers();
  // Vercel injects coarse edge location. Outside that platform it is untrusted.
  // No IP, city, coordinates or country/state values are serialized to the client.
  return privacyRegion(process.env.VERCEL === "1", request.get("x-vercel-ip-country"), request.get("x-vercel-ip-country-region"), request.get("sec-gpc"), request.get("dnt"));
}
