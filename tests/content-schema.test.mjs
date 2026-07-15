import assert from "node:assert/strict";
import test from "node:test";

import { getContentSaveError } from "../src/lib/content-save-error.ts";
import { siteContentSchema } from "../src/lib/content-schema.ts";
import { getAvailableProjectSlug, normalizeSiteContentForSave, seedContent } from "../src/lib/content.ts";

function copySeed() {
  return structuredClone(seedContent);
}

function assertInvalidAt(content, expectedPath) {
  const result = siteContentSchema.safeParse(content);
  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some((issue) => issue.path.join(".") === expectedPath),
    `Expected an issue at ${expectedPath}; received ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
  );
}

test("accepts the complete seed content document", () => {
  const result = siteContentSchema.safeParse(copySeed());
  assert.equal(result.success, true);
  assert.deepEqual(result.data, seedContent);
});

test("rejects malformed nested service deliverables", () => {
  const content = copySeed();
  content.services[0].deliverables = [];
  assertInvalidAt(content, "services.0.deliverables");
});

test("rejects non-HTTPS public social links", () => {
  const content = copySeed();
  content.social[0].href = "http://example.com/profile";
  assertInvalidAt(content, "social.0.href");
});

test("rejects invalid public image URLs", () => {
  const content = copySeed();
  content.about.image = "not-a-url";
  assertInvalidAt(content, "about.image");
});

test("rejects image URLs that Next Image cannot render", () => {
  const content = copySeed();
  content.hero.image = "https://example.com/photo.jpg";
  assertInvalidAt(content, "hero.image");
});

test("keeps an empty project location backward-compatible", () => {
  const content = copySeed();
  content.projects[0].location = "";
  assert.equal(siteContentSchema.safeParse(content).success, true);
});

test("generates an unused project slug after earlier projects are removed", () => {
  const projects = copySeed().projects.slice(1);
  projects.push({ ...copySeed().projects[0], slug: "new-project-7" });
  projects.push({ ...copySeed().projects[0], slug: "new-project-8" });
  assert.equal(projects.length, 7);
  assert.equal(getAvailableProjectSlug(projects), "new-project-9");
});

test("normalizes blank service deliverable lines before save", () => {
  const content = copySeed();
  content.services[0].deliverables = ["Campaign", "", "  Editorial  ", "   "];
  const normalized = normalizeSiteContentForSave(content);
  assert.deepEqual(normalized.services[0].deliverables, ["Campaign", "Editorial"]);
  assert.deepEqual(content.services[0].deliverables, ["Campaign", "", "  Editorial  ", "   "]);
});

test("rejects duplicate service slugs", () => {
  const content = copySeed();
  content.services[1].slug = content.services[0].slug;
  assertInvalidAt(content, "services.1.slug");
});

test("rejects duplicate social labels", () => {
  const content = copySeed();
  content.social[1].label = content.social[0].label.toUpperCase();
  assertInvalidAt(content, "social.1.label");
});

test("rejects unknown nested content fields", () => {
  const content = copySeed();
  content.contact.unexpected = "not allowed";
  assertInvalidAt(content, "contact");
});

test("turns bounded API field paths into a useful save error", async () => {
  const response = Response.json({
    code: "invalid_content",
    fields: ["services.0.deliverables", "social.0.href"],
  }, { status: 400 });
  assert.equal(
    await getContentSaveError(response),
    "Review these fields before publishing: services.0.deliverables, social.0.href.",
  );
});
