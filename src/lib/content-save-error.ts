type ContentSaveErrorBody = {
  code?: unknown;
  fields?: unknown;
};

export async function getContentSaveError(response: Response) {
  let body: ContentSaveErrorBody = {};
  try {
    body = await response.json() as ContentSaveErrorBody;
  } catch {
    return "Unable to publish. Your edits remain here; retry in a moment.";
  }

  if (body.code === "invalid_content" && Array.isArray(body.fields)) {
    const fields = body.fields.filter((field): field is string => typeof field === "string").slice(0, 5);
    if (fields.length > 0) return `Review these fields before publishing: ${fields.join(", ")}.`;
  }

  if (body.code === "content_write_blocked") {
    return "Publishing is paused because stored content could not be verified. Reload before retrying.";
  }

  if (body.code === "storage_not_configured") {
    return "Publishing requires persistent Blob storage configuration.";
  }

  return "Unable to publish. Your edits remain here; retry in a moment.";
}
