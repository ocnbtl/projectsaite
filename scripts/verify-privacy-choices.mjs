import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the real UI components with only framework/media/store boundaries mocked.
// No browser, production credentials, or analytics transport are needed.
const react = React.createElement;
const framework = {
  react: React,
  "next/link": { default: ({ href, children, ...props }) => react("a", { href, ...props }, children) },
  "next/image": { default: ({ unoptimized, ...props }) => { assert.equal(unoptimized, true); return react("img", props); } },
  "next/navigation": { usePathname: () => "/" },
  "next/web-vitals": { useReportWebVitals: () => undefined },
  "@/lib/content": { publicNavigation: [] },
  "@/lib/content-store": { getSiteContent: async () => ({ contact: { email: "fixture@example.invalid" } }) },
  "@/lib/analytics": {},
  "@/lib/analytics-policy": {},
};

async function load(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  const require = (name) => {
    assert.ok(Object.hasOwn(framework, name), "unexpected dependency: " + name);
    return framework[name];
  };
  vm.runInNewContext(compiled, { exports, React, require, process: { env: { NEXT_PUBLIC_POSTHOG_KEY: "phc_fixture" } } });
  return exports;
}

const { SiteFooter } = await load("../src/components/site/site-footer.tsx");
const footer = renderToStaticMarkup(await SiteFooter());
assert.match(footer, /href="\/privacy">Privacy Policy<\/a>/);
assert.match(footer, /href="\/privacy#settings"[^>]*>Your Privacy Choices<img[^>]*src="\/california-privacy-choices\.svg"/);
assert.doesNotMatch(footer, /<button|role="dialog"/);
const { PrivacySettings } = await load("../src/components/site/privacy-settings.tsx");
const privacy = renderToStaticMarkup(react(PrivacySettings, { environment: "local" }));
assert.match(privacy, /id="settings"/);
assert.match(privacy, /Your Privacy Choices/);
assert.equal((privacy.match(/role="switch"/g) ?? []).length, 2);
assert.doesNotMatch(privacy, /\schecked(?:=|\s|>)/);
const { AnalyticsConsent } = await load("../src/components/site/analytics-consent.tsx");
assert.equal(renderToStaticMarkup(react(AnalyticsConsent, { environment: "local" })), "");
const icon = await readFile(new URL("../public/california-privacy-choices.svg", import.meta.url));
assert.equal(createHash("sha256").update(icon).digest("hex"), "86f2eb97cc1f3909c12e4512de9e267215d94ac5aaee9393d0f007f18c34e8ba");
console.log("PASS Sage footer links and official local icon, settings controls initially off, and no global consent UI");
