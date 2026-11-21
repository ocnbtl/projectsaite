// A build-time allowlist, never derived from a visitor's DOM or CMS uploads.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
async function files(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const literals = new Set();
for (const file of await files('src')) {
  if (!/\.(tsx?|json)$/.test(file) || /replay-public-manifest|analytics|replay-safety/.test(file)) continue;
  const source = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, ' ').trim();
      if (text && text.length < 3000 && !/@|https?:|password|secret|token/i.test(text)) literals.add(text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const assets = (await files('public/media')).map(f => '/' + f.replaceAll('\\', '/').replace(/^public\//, ''));
const cssClasses = [];
for (const file of await files('src')) if (file.endsWith('.css')) {
  const css = await readFile(file, 'utf8');
  cssClasses.push(...[...css.matchAll(/\.([a-z_][a-z0-9_-]*)/gi)].map(m => m[1]));
}
const classes = [...new Set([...literals].flatMap(s => s.split(/\s+/)).filter(s => /^[a-z][a-z0-9_-]+$/i.test(s)).concat(cssClasses))];
await writeFile('src/lib/replay-public-manifest.json', JSON.stringify({ text: [...literals].sort(), classes: classes.sort(), assets: assets.sort() }) + '\n');
console.log(`Replay allowlist: ${literals.size} static strings, ${assets.length} checked-in assets`);
