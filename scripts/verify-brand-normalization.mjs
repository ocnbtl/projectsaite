import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const media = dataUrl(compile(await readFile(new URL("../src/content/portfolio-media.ts", import.meta.url), "utf8")));
const additions = dataUrl(compile(await readFile(new URL("../src/content/portfolio-additions.ts", import.meta.url), "utf8")));
const source = await readFile(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const { normalizeSiteContent, seedContent } = await import(dataUrl(compile(source).replace('"@/content/portfolio-media"', JSON.stringify(media)).replace('"@/content/portfolio-additions"', JSON.stringify(additions))));
const stored = { ...seedContent, featuredBrands: [
  { id: "donnys-devils", name: "Old designer one" },
  { id: "diyanni-surf", name: "Old designer two" },
  { id: "highest-on-the-runway", name: "Highest on the Runway · Paris" },
  { id: "custom-owner-credit", name: "Owner-managed credit", logo: "/custom-owner-logo.svg" },
  { id: "fischer-homes", name: "Fischer Homes — face painting", logo: "/media/brands/fischer-homes.svg" },
] };
const before = JSON.stringify(stored);
assert.equal(seedContent.about.image, "/media/sage/agency/zh14h2356ikjkc.jpg");
assert.equal(normalizeSiteContent({ ...seedContent, about: { ...seedContent.about, image: "/media/sage/v1/sage-001.webp", imageAlt: "Old portrait" } }).about.image, seedContent.about.image);
assert.equal(normalizeSiteContent({ ...seedContent, about: { ...seedContent.about, image: "/owner-custom.jpg", imageAlt: "Owner custom portrait" } }).about.image, "/owner-custom.jpg");
assert.equal(normalizeSiteContent({ ...seedContent, about: { ...seedContent.about, image: "/owner-custom.jpg", imageAlt: "Owner custom portrait" } }).about.imageAlt, "Owner custom portrait");
const result = normalizeSiteContent(stored);
assert(!result.featuredBrands.some(brand => ["donnys-devils", "diyanni-surf"].includes(brand.id)));
for (const id of ["highest-on-the-runway", "new-york-fashion-week", "paris-fashion-week"]) {
  assert.equal(result.featuredBrands.filter(brand => brand.id === id).length, 1);
  assert.equal(result.featuredBrands.find(brand => brand.id === id).logo, `/media/brands/${id}.png`);
}
assert.deepEqual(result.featuredBrands.find(brand => brand.id === "custom-owner-credit"), stored.featuredBrands[3]);
assert.equal(JSON.stringify(stored), before);
assert.equal(result.featuredBrands.filter(brand => brand.id === "fischer-homes").length, 1);
assert.deepEqual(result.featuredBrands.find(brand => brand.id === "fischer-homes"), { id: "fischer-homes", name: "Fischer Homes", logo: "/media/brands/fischer-homes.svg", invert: undefined });
assert.equal(normalizeSiteContent(result).featuredBrands.filter(brand => brand.id === "fischer-homes").length, 1);
assert.deepEqual(result.featuredBrands.slice(0, 10).map(brand => brand.id), ["macys", "saks-fifth-avenue", "university-cincinnati", "xavier-university", "new-york-fashion-week", "paris-fashion-week", "versed-skincare", "fischer-homes", "heyman-talent", "rebel-magazine"]);
assert.equal(result.featuredBrands.length, 25);
assert.equal(new Set(result.featuredBrands.map(brand => brand.id)).size, 25);
assert.equal(normalizeSiteContent({ ...stored, featuredBrands: [{ id: "fischer-homes", name: "Owner custom label" }] }).featuredBrands.find(brand => brand.id === "fischer-homes").name, "Owner custom label");
for (const logo of ["/media/brands/heyman-talent.png", "/media/brands/heyman-talent-transparent.png"]) {
  const legacy = { ...stored, featuredBrands: [{ id: "heyman-talent", name: "Heyman Talent", logo }] };
  assert.equal(normalizeSiteContent(legacy).featuredBrands.find(brand => brand.id === "heyman-talent").logo, "/media/brands/heyman-talent-symbol.png");
  assert.equal(legacy.featuredBrands[0].logo, logo);
}
assert.equal(normalizeSiteContent({ ...stored, featuredBrands: [{ id: "heyman-talent", name: "Heyman Talent", logo: "/owner-custom.svg" }] }).featuredBrands.find(brand => brand.id === "heyman-talent").logo, "/owner-custom.svg");
console.log("PASS: priority order, defaults, legacy brand/About migration, custom labels/assets and stored input preserved (25 assertions)");
