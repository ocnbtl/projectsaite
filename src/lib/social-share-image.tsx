import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const socialShareImageSize = {
  width: 1200,
  height: 630,
};

export async function createSocialShareImage() {
  const iconData = await readFile(join(process.cwd(), "src/app/icon.svg"), "base64");
  const iconSource = `data:image/svg+xml;base64,${iconData}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f6f1f1",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* ImageResponse renders the existing favicon into a social-platform-safe PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" height={320} src={iconSource} width={320} />
      </div>
    ),
    socialShareImageSize,
  );
}
