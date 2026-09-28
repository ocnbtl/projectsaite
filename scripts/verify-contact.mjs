// Executes the actual contact route and delivery code with a fake email provider.
// No real credentials, fetch implementation, network calls or deliveries are available.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server.js";

const input = { name: "Local Test", email: "local-test@example.invalid", inquiry: "Modeling", message: "Mocked contact verification only. No real message.", website: "" };
async function load({ key = "fake_test_key", response = { data: { id: "mock-accepted-id" }, error: null } } = {}) {
  const deliveries = [];
  const context = vm.createContext({ process: { env: { RESEND_API_KEY: key, CONTACT_TO_EMAIL: "recipient@example.invalid" } }, console: { error: () => {} } });
  class MockResend { emails = { send: async payload => { deliveries.push(payload); return response; } }; }
  const synthetic = exports => new vm.SyntheticModule(Object.keys(exports), function () { for (const [name, value] of Object.entries(exports)) this.setExport(name, value); }, { context });
  const modules = new Map();
  async function moduleAt(file) {
    if (modules.has(file)) return modules.get(file);
    const text = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    const code = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    const sourceModule = new vm.SourceTextModule(code, { context });
    modules.set(file, sourceModule);
    await sourceModule.link(async name => {
      if (name === "server-only") return synthetic({});
      if (name === "resend") return synthetic({ Resend: MockResend });
      if (name === "zod") return synthetic({ z });
      if (name === "next/server") return synthetic({ NextRequest, NextResponse });
      if (name === "@/lib/contact") return moduleAt("src/lib/contact.ts");
      if (name === "@/lib/rate-limit") return moduleAt("src/lib/rate-limit.ts");
      throw new Error(`Unexpected import in contact test: ${name}`);
    });
    return sourceModule;
  }
  const route = await moduleAt("src/app/api/contact/route.ts");
  await route.evaluate();
  return { deliveries, post: payload => route.namespace.POST(new NextRequest("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": "127.0.0.1" }, body: JSON.stringify(payload) })) };
}
let app = await load();
let result = await app.post({ ...input, email: "invalid" });
assert.equal(result.status, 400);
assert.equal(app.deliveries.length, 0);
result = await app.post({ ...input, website: "spam.invalid" });
assert.equal(result.status, 400);
assert.equal(app.deliveries.length, 0);
result = await app.post(input);
assert.equal(result.status, 200);
assert.deepEqual(await result.json(), { ok: true, delivery: "accepted" });
assert.equal(app.deliveries.length, 1);
assert.equal(app.deliveries[0].to, "recipient@example.invalid");
app = await load({ key: "" });
assert.equal((await app.post(input)).status, 503);
assert.equal(app.deliveries.length, 0);
for (const response of [{ data: null, error: null }, { data: null, error: { message: "MOCK_PRIVATE_PROVIDER_ERROR" } }]) {
  app = await load({ response });
  result = await app.post(input);
  assert.equal(result.status, 500);
  assert.deepEqual(await result.json(), { code: "delivery_failed" });
}
app = await load();
for (let i=0; i<5; i++) await app.post(input);
assert.equal((await app.post(input)).status, 429);
assert.equal(app.deliveries.length, 5);
console.log("PASS: real route validation, honeypot, mocked provider acceptance, missing configuration, missing provider ID, provider rejection and rate limiting. No real email sent.");
