// Isolated full-site QA. Start Next on 3118 with fixture key and collector 3119.
// Browser visits 3120. Never proxy analytics to PostHog or permit form/API writes.
import http from "node:http";
import { gunzipSync } from "node:zlib";
import { writeFile, readFile, mkdir } from "node:fs/promises";
let mode = "fresh", generation = Date.now();
const requests = [], events = [], errors = [];
const vercelScript = await fetch('https://sageburress.com/_vercel/insights/script.js').then(r => { if (!r.ok) throw Error('Unable to read existing Vercel analytics client'); return r.text(); });
if (process.argv[2]) {
  const saved = JSON.parse(await readFile(process.argv[2], 'utf8'));
  events.push(...saved.events); requests.push(...saved.requests); mode = 'archived-desktop';
}
async function report() {
  const snapshots = events.filter(e => e.event === "$snapshot");
  const decoded = JSON.stringify(events.map(decode));
  const raw = JSON.stringify(requests);
  return { mode, generation, requests: requests.length, events: events.map(e => e.event), snapshotBatches: snapshots.length,
    canaryInDecoded: decoded.includes("CANARY_PRIVATE"), canaryInRaw: raw.includes("CANARY_PRIVATE"), errors,
    publicCopy: JSON.stringify(snapshots).includes("Sage"), publicLayout: JSON.stringify(snapshots).includes("editorial-hero"),
    hasFullSnapshot: snapshots.some(e => e.properties?.$snapshot_data?.some(s => s.type === 2 && s.data?.node)),
    vercelRequests: requests.filter(r => r.vendor === 'vercel').length,
    vercelBodies: requests.filter(r => r.vendor === 'vercel').map(r => { try {return JSON.parse(r.body);} catch {return null;} }) };
}
function decode(value) {
  if (value?.charCodeAt?.(0) === 31) return decode(JSON.parse(gunzipSync(Buffer.from(value, "latin1"))));
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,decode(v)]));
  return value;
}
http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3120");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  const url = new URL(req.url, "http://127.0.0.1:3119");
  if (url.pathname === "/control") { mode = url.searchParams.get("mode") ?? "fresh"; generation++; requests.length = events.length = errors.length = 0; res.end("Ready: " + mode); return; }
  if (url.pathname === '/external-referrer') {res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Referrer-Policy','unsafe-url');res.end('<a href="http://127.0.0.1:3120/">Open isolated site</a>');return;}
  if (url.pathname === "/report") { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(await report(), null, 2)); return; }
  if (url.pathname === "/save") { await mkdir("output/playwright", { recursive: true }); await writeFile(`output/playwright/payloads-${mode}-${generation}.json`, JSON.stringify({ summary: await report(), events: events.map(decode), requests }, null, 2)); res.end("Saved local evidence"); return; }
  if (url.pathname === "/restored") {
    const stream = events.map(decode).flatMap(e => e.properties?.$snapshot_data ?? []);
    const full = stream.find(s => s.type === 2 && s.data?.node);
    if (full) {
      const byId = new Map();
      const visit = n => { byId.set(n.id,n); (n.childNodes ?? []).forEach(visit); };
      visit(full.data.node);
      for (const event of stream) if (event.type === 3 && event.data?.source === 0) {
        for (const a of event.data.attributes ?? []) { const n=byId.get(a.id); if(n) Object.assign(n.attributes ??= {},a.attributes); }
        for (const t of event.data.texts ?? []) { const n=byId.get(t.id); if(n) n.textContent=t.value; }
        for (const r of event.data.removes ?? []) { const parent=byId.get(r.parentId); if(parent) parent.childNodes=parent.childNodes.filter(n=>n.id!==r.id); }
        for (const a of event.data.adds ?? []) { const parent=byId.get(a.parentId); if(parent) {parent.childNodes ??= []; const index=parent.childNodes.findIndex(n=>n.id===a.nextId); parent.childNodes.splice(index<0?parent.childNodes.length:index,0,a.node);visit(a.node);} }
      }
    }
    function node(n) {
      const escape = s => String(s ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
      if (n.type === 3) return n.textContent ?? "";
      if (n.type !== 2 || ["script", "iframe", "object", "embed", "base"].includes(n.tagName)) return "";
      const tag = n.attributes?._cssText ? "style" : n.tagName;
      return `<${tag} ${Object.entries(n.attributes ?? {}).filter(([k]) => !k.startsWith("_") && !k.startsWith("on")).map(([k,v]) => `${k}="${escape(v)}"`).join(" ")}>${n.attributes?._cssText ?? (n.childNodes ?? []).map(node).join("")}</${tag}>`;
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(full ? '<!doctype html><meta charset="utf-8"><base href="http://127.0.0.1:3120">' + full.data.node.childNodes.map(node).join("") : "No full snapshot yet"); return;
  }
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  try {
    let bytes = Buffer.concat(chunks); if (bytes[0] === 31) bytes = gunzipSync(bytes);
    const raw = bytes.toString(); requests.push({ path: req.url, body: raw });
    if (raw) {
      let value = raw.startsWith("{") || raw.startsWith("[") ? raw : new URLSearchParams(raw).get("data");
      if (value) {
        if (!value.startsWith("{") && !value.startsWith("[")) value = Buffer.from(value, "base64").toString();
        const parsed = JSON.parse(value);
        for (const event of Array.isArray(parsed) ? parsed : parsed.batch ?? [parsed]) {
          if (!event.event) continue;
          for (const snapshot of event.properties?.$snapshot_data ?? []) snapshot.data = decode(snapshot.data);
          events.push(event);
        }
      }
    }
  } catch (e) { errors.push(e.message); }
  res.setHeader("Content-Type", "application/json");
  if (mode === 'retry-withdrawal' && req.method === 'POST' && !req.url.includes('flags') && !req.url.includes('decide')) { res.writeHead(503).end('{"status":0}'); return; }
  res.end(JSON.stringify({ status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true, sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 } }));
}).listen(3119, "127.0.0.1");
http.createServer(async (req, res) => {
  if (req.url === '/_vercel/insights/script.js') {res.setHeader('Content-Type','application/javascript');res.end(vercelScript);return;}
  if (req.url.startsWith('/_vercel/insights/') && req.method === 'POST') {const chunks=[];for await(const c of req)chunks.push(c);requests.push({vendor:'vercel',path:req.url,body:Buffer.concat(chunks).toString()});res.setHeader('Content-Type','application/json');res.end('{}');return;}
  if (req.url.startsWith('/internal-referrer')) {res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Referrer-Policy','unsafe-url');res.end('<a href="http://127.0.0.1:3120/">Open isolated site</a>');return;}
  if (!['GET', 'HEAD'].includes(req.method) || req.url.startsWith('/api/')) { res.writeHead(405).end('QA blocks writes'); return; }
  try {
    const headers = { accept: req.headers.accept ?? '*/*' };
    if (mode !== 'unknown') { headers['x-vercel-ip-country'] = 'US'; headers['x-vercel-ip-country-region'] = mode === 'state-hold' ? 'CA' : 'OH'; }
    if (mode === 'header-gpc') headers['sec-gpc'] = '1';
    if (mode === 'header-dnt') headers.dnt = '1';
    for (const key of ['rsc', 'next-router-state-tree', 'next-router-prefetch', 'next-router-segment-prefetch', 'next-url']) if (typeof req.headers[key] === 'string') headers[key] = req.headers[key];
    const upstream = await fetch('http://127.0.0.1:3118' + req.url, { headers });
    res.statusCode = upstream.status;
    for (const [key,value] of upstream.headers) if (!['content-encoding','content-length','transfer-encoding','connection'].includes(key)) res.setHeader(key,value);
    if (!(upstream.headers.get('content-type') ?? '').includes('text/html')) { res.end(Buffer.from(await upstream.arrayBuffer())); return; }
    const seed = `<script>if(localStorage.getItem('qa-generation')!=='${generation}') {localStorage.clear();sessionStorage.clear();localStorage.setItem('qa-generation','${generation}');${mode === 'denied' ? "localStorage.setItem('sage-analytics-consent-v1','denied');" : ''}${['gpc','dnt'].includes(mode) ? "localStorage.setItem('sage-analytics-consent-v1','recordings');" : ''}}${mode === 'gpc' ? "Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>true});" : ''}${mode === 'dnt' ? "Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});" : ''}</script>`;
    const fixture = `<script>setTimeout(()=>{const f=document.createElement('div'); f.id='CANARY_PRIVATE_ID';f.title='CANARY_PRIVATE_TITLE';f.setAttribute('data-secret','CANARY_PRIVATE_DATA');f.innerHTML='<span>CANARY_PRIVATE_TEXT</span><form><input value="CANARY_PRIVATE_INPUT"><textarea>CANARY_PRIVATE_MESSAGE</textarea><input type="file" data-file="CANARY_PRIVATE_UPLOAD"></form><div data-analytics-private>CANARY_PRIVATE_AREA</div><a href="mailto:CANARY_PRIVATE_EMAIL@example.invalid">CANARY_PRIVATE_EMAIL</a><img src="data:image/svg+xml,CANARY_PRIVATE_IMAGE"><a href="/contact?email=CANARY_PRIVATE_QUERY">CANARY_PRIVATE_LINK</a>';document.body.append(f);console.log('CANARY_PRIVATE_CONSOLE');window.dispatchEvent(new ErrorEvent('error',{message:'CANARY_PRIVATE_ERROR'}));},2000);</script>`;
    const neutralSignals = ['gpc', 'dnt'].includes(mode) ? '' : "<script>Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>false});Object.defineProperty(navigator,'doNotTrack',{get:()=> '0'});</script>";
    const cssFixture = `<script>setTimeout(()=>{const s=document.createElement('style');s.textContent='.qa-private-canary::before{content:"CANARY_PRIVATE_CSS"}';document.body.append(s);try{s.sheet.insertRule('.qa-private-other{--private:"CANARY_PRIVATE_RULE"}');}catch{}fetch('/api/qa-blocked?token=CANARY_PRIVATE_NETWORK',{method:'POST',body:'CANARY_PRIVATE_BODY',headers:{'X-QA-Secret':'CANARY_PRIVATE_HEADER'}}).catch(()=>{});},2200);</script>`;
    res.end((await upstream.text()).replace('<head>', '<head>' + neutralSignals + seed).replace('</body>', fixture + cssFixture + '</body>'));
  } catch { res.writeHead(502).end('Next preview is not ready'); }
}).listen(3120, '127.0.0.1', () => console.log('Isolated QA preview http://127.0.0.1:3120; collector/report http://127.0.0.1:3119/report'));
