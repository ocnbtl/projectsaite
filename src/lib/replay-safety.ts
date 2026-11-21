import manifest from "./replay-public-manifest.json";
import { publicPath } from "./analytics-policy";

const text = new Set(manifest.text);
const classes = new Set(manifest.classes);
const assets = new Set(manifest.assets);
export function replayText(value: string) {
  return text.has(value.replace(/\s+/g, " ").trim()) ? value : value.replace(/\S/g, "*");
}
export function replayUrl(value: string) {
  try {
    const url = new URL(value, location.origin);
    if (url.origin !== location.origin) return "";
    if (!url.search && !url.hash && (assets.has(url.pathname) || publicPath(url.pathname) || /^\/_next\/static\/[a-zA-Z0-9_./-]+$/.test(url.pathname))) return url.pathname;
    if (url.pathname === "/_next/image" && !url.hash && [...url.searchParams.keys()].every(k => ["url", "w", "q"].includes(k)) && assets.has(url.searchParams.get("url") ?? "") && /^\d+$/.test(url.searchParams.get("w") ?? "") && /^\d+$/.test(url.searchParams.get("q") ?? "")) return url.pathname + url.search;
  } catch { /* Fail closed. */ }
  return "";
}
export function replayAttribute(name: string, value: string) {
  if (name === "class") return value.split(/\s+/).filter(v => classes.has(v) || /^_[A-Za-z0-9]{6}_variable$/.test(v)).join(" ");
  if (name === "rel" && value === "stylesheet") return value;
  if (name === "lang" && value === "en") return value;
  if (name === "data-visual-text" && ["Sage", "Burress"].includes(value)) return value;
  if (name === "data-home-intro-complete" && value === "true") return value;
  if (name === "data-home-reveal" && text.has(value)) return value;
  if (name === "style") return value.split(";").map(part => part.trim()).filter(part => /^(position:\s*absolute|(?:width|height):\s*100%|(?:left|right|top|bottom):\s*0(?:px)?|color:\s*transparent)$/i.test(part)).join("; ");
  if (["id", "role", "alt", "title", "aria-label"].includes(name)) return text.has(value) ? value : "";
  if (["href", "src", "poster", "xlink:href"].includes(name)) return replayUrl(value);
  if (name === "srcset") return value.split(",").map(part => {
    const [url, size] = part.trim().split(/\s+/);
    const safe = replayUrl(url);
    return safe && /^\d+(w|x)$/.test(size ?? "") ? `${safe} ${size}` : "";
  }).filter(Boolean).join(", ");
  if (["width", "height", "viewBox", "d", "points", "cx", "cy", "r", "x", "y", "stroke-width"].includes(name) && /^[\d\s.,MLCQZAHVSTmlcqzahvst%+-]+$/.test(value) && value.length < 10000) return value;
  if (["fill", "stroke"].includes(name) && /^(none|currentColor|#[\da-f]{3,8})$/i.test(value)) return value;
  if (["aria-hidden", "hidden", "open"].includes(name) && ["", "true", "false"].includes(value)) return value;
  return ""; // Includes data-*, values, arbitrary inline CSS, upload URLs and identifiers.
}
