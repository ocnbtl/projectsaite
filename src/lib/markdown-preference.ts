/** Honor explicit media preferences, not user-agent identity. Browsers keep HTML. */
export function prefersMarkdown(accept: string) {
  const media = accept.toLowerCase().split(",").map(value => {
    const [type, ...params] = value.trim().split(";");
    const parameter = params.map(item => item.trim()).find(item => item.startsWith("q="));
    const weight = parameter ? Number(parameter.slice(2)) : 1;
    return { type, weight: Number.isFinite(weight) && weight >= 0 && weight <= 1 ? weight : 0 };
  });
  const markdown = Math.max(0, ...media.filter(item => item.type === "text/markdown").map(item => item.weight));
  const html = Math.max(0, ...media.filter(item => item.type === "text/html" || item.type === "application/xhtml+xml").map(item => item.weight));
  return markdown > 0 && markdown > html;
}
