"use client";
import { createContext, useContext } from "react";
import type { PrivacyRegion } from "@/lib/analytics-policy";
const Region = createContext<PrivacyRegion>({ defaultsAllowed: false, replayDefaultAllowed: false, blocked: false });
export function PrivacyRegionProvider({ policy, children }: { policy: PrivacyRegion; children: React.ReactNode }) {
  return <Region.Provider value={policy}>{children}</Region.Provider>;
}
export function usePrivacyRegion() { return useContext(Region); }
