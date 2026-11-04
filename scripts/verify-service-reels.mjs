import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import ts from "typescript";

const load = async path => {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const { contentCreationReels, travelReels } = await load("../src/content/service-reels.ts");
const { REELS } = await load("../src/lib/analytics-policy.ts");
const sources = await readFile(new URL("../public/media/reels/SOURCES.md", import.meta.url), "utf8");
const numericViews = value => {
  const match = /^(\d+(?:\.\d+)?)([KM])?$/.exec(value.replaceAll(",", ""));
  assert(match, `Invalid Instagram views: ${value}`);
  return Number(match[1]) * ({ K: 1000, M: 1000000 }[match[2]] ?? 1);
};
assert.equal(numericViews("23K"), 23000);
assert.equal(numericViews("1.2M"), 1200000);
assert.equal(numericViews("4,230"), 4230);
assert.deepEqual(contentCreationReels.map(r => r.id), ["DcPCf61JC_A", "DOZGwmliabC", "DdfKnCVJpp_", "Ddo5D8uJbMw", "DUsxBB9kZ9t", "DUjZuJvCRyd", "DdmF7BoRO4i"]);
assert.deepEqual(travelReels.map(r => r.id), ["DdaFZX4JFLA", "DQkL8qsiaO2", "DdbmqQ7RlDQ", "DdhgiJ-p5pB", "DdcHGPxJn5i"]);
for (const gallery of [contentCreationReels, travelReels]) {
  const counts = gallery.map(reel => numericViews(reel.instagram.views));
  assert(counts.every((count, index) => index === 0 || counts[index - 1] >= count), "Each gallery must run from highest to lowest Instagram views");
}
for (const reel of [...contentCreationReels, ...travelReels]) {
  assert(REELS.includes(reel.id), `Analytics must recognize ${reel.id}`);
  assert.equal(reel.href, `https://www.instagram.com/reel/${reel.id}/`);
  assert.equal(reel.instagram.updated, "2026-11-04");
  assert.equal(typeof reel.instagram.views, "string", "Preserve Instagram's displayed count precision");
  assert.match(reel.instagram.views, /^(?:[1-9]\d{0,2}(?:,\d{3})*|[1-9]\d*(?:\.\d+)?[KM])$/);
  assert.equal(reel.instagram.likes, undefined, "Display views instead of likes");
  assert(sources.includes(`| ${reel.id} | ${reel.instagram.views} |`), "Each count must match the recorded source snapshot");
  for (const path of [reel.src, reel.poster]) assert((await stat(new URL(`../public${path}`, import.meta.url))).size > 1000, path);
  const video = await readFile(new URL(`../public${reel.src}`, import.meta.url));
  assert.equal(video.toString("ascii", 4, 8), "ftyp", "MP4 container");
  assert(video.indexOf(Buffer.from("moov")) < video.indexOf(Buffer.from("mdat")), "Fast-start streaming metadata");
}
console.log("PASS: 7 content + 5 travel reels in descending numeric view order; 24 local media assets, fast-start MP4s, truthful counts and analytics IDs");
