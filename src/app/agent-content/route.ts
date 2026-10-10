import { getSiteContent } from "@/lib/content-store";
import { publicMarkdown } from "@/lib/public-markdown";
import { siteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const headers = new Headers({ "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", "Cache-Control": "private, no-store" });
  if (path === "/services") return Response.redirect(`${siteUrl}/services/modeling`, 308);
  const content = await getSiteContent();
  const body = publicMarkdown(path, content);
  if (!body) {
    headers.set("X-Robots-Tag", "noindex");
    return new Response(`# Page not found\n\nThis page does not exist. Explore [Sage Burress](${siteUrl}/), the [sitemap](${siteUrl}/sitemap.xml), or the [site guide](${siteUrl}/llms.txt).\n`, { status: 404, headers });
  }
  headers.set("Link", `<${siteUrl}${path === "/" ? "/" : path.replace(/\/$/, "")}>; rel="canonical"`);
  return new Response(body, { headers });
}
