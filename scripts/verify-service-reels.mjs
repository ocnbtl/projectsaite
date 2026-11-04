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
assert.deepEqual(contentCreationReels.map(r => r.id), ["Ddo5D8uJbMw", "DdmF7BoRO4i", "DcPCf61JC_A", "DUjZuJvCRyd", "DUsxBB9kZ9t", "DOZGwmliabC", "DdfKnCVJpp_"]);
assert.deepEqual(travelReels.map(r => r.id), ["DdcHGPxJn5i", "DdbmqQ7RlDQ", "DQkL8qsiaO2", "DdhgiJ-p5pB", "DdaFZX4JFLA"]);
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
console.log("PASS: 7 content + 5 travel reels in approved order; 24 local media assets, fast-start MP4s, truthful counts and analytics IDs");
