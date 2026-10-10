import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const media = dataUrl(compile(await readFile(new URL("../src/content/portfolio-media.ts", import.meta.url), "utf8")));
const source = await readFile(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const { normalizeSiteContent, seedContent } = await import(dataUrl(compile(source).replace('"@/content/portfolio-media"', JSON.stringify(media))));
const stored = { ...seedContent, featuredBrands: [
  { id: "donnys-devils", name: "Old designer one" },
  { id: "diyanni-surf", name: "Old designer two" },
  { id: "highest-on-the-runway", name: "Highest on the Runway · Paris" },
  { id: "custom-owner-credit", name: "Owner-managed credit", logo: "/custom-owner-logo.svg" },
] };
const before = JSON.stringify(stored);
const result = normalizeSiteContent(stored);
assert(!result.featuredBrands.some(brand => ["donnys-devils", "diyanni-surf"].includes(brand.id)));
for (const id of ["highest-on-the-runway", "new-york-fashion-week", "paris-fashion-week"]) {
  assert.equal(result.featuredBrands.filter(brand => brand.id === id).length, 1);
  assert.equal(result.featuredBrands.find(brand => brand.id === id).logo, `/media/brands/${id}.png`);
}
assert.deepEqual(result.featuredBrands.find(brand => brand.id === "custom-owner-credit"), stored.featuredBrands[3]);
assert.equal(JSON.stringify(stored), before);
console.log("PASS: retired persisted rail entries excluded, new assets merged once, other custom credits preserved, stored input untouched (9 assertions)");
