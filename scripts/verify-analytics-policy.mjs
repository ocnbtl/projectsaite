import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/analytics-policy.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const policy = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const { isAnalyticsEnvironment: env, publicPath: path, trafficSource: sourceOf } = policy;
assert.equal(env("production", "sageburress.com"), true);
assert.equal(env("production", "www.sageburress.com"), true);
assert.equal(env("preview", "sageburress.com", true), false);
assert.equal(env("production", "projectsaite-preview.vercel.app", true), false);
assert.equal(env("local", "127.0.0.1"), false);
assert.equal(env("local", "127.0.0.1", true), true);
assert.equal(env("production", "localhost", true), false);
assert.equal(env("local", "other.example", true), false);
assert.equal(path("/contact/"), "/contact");
for (const route of ["/admin/login", "/api/contact", "/uploads/PRIVATE", "/contact/PRIVATE", "/private@example.com"]) assert.equal(path(route), null);
assert.equal(sourceOf("https://sageburress.com/?utm_source=ig&email=secret", ""), "instagram");
assert.equal(sourceOf("https://sageburress.com/?utm_source=__proto__", ""), "direct_or_unknown");
assert.equal(sourceOf("https://sageburress.com/?utm_source=someone@example.com", ""), "direct_or_unknown");
assert.equal(sourceOf("https://sageburress.com/", "https://l.instagram.com/?private=value"), "instagram");
assert.equal(sourceOf("https://sageburress.com/", "https://instagram.com.evil.example/private"), "other_referral");
for (const [host, expected] of [["claude.ai", "claude"], ["www.perplexity.ai", "perplexity"], ["gemini.google.com", "gemini"]]) assert.equal(sourceOf("https://sageburress.com/", `https://${host}/private`), expected);
assert.equal(sourceOf("https://sageburress.com/?utm_source=google_business", ""), "google_business");
assert.equal(policy.serviceCategory("Travel Promotions"), "travel-collaborations");
assert.equal(policy.serviceCategory("private@example.com"), "other");
assert.equal(policy.serviceCategory("__proto__"), "other");
const point = { x: 1.7, y: 22, type: "click", target_fixed: true, text: "PRIVATE" };
assert.deepEqual(policy.safeHeatmap({
  "https://sageburress.com/": [point],
  "https://sageburress.com/contact": [point],
  "https://sageburress.com/?email=PRIVATE": [point],
  "https://sageburress.com/admin": [point],
  "https://other.example/": [point],
}, "https://sageburress.com"), { "https://sageburress.com/": [{ x: 2, y: 22, type: "click", target_fixed: true }] });
console.log("PASS: environment isolation, sensitive route exclusion, categorical sources and service sanitization");
