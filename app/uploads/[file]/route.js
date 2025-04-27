import { NextResponse } from "next/server";
import { join, extname, resolve } from "path";
import { existsSync, createReadStream } from "fs";

export const runtime = "nodejs"; // Force Node.js runtime

const getContentType = (ext) => {
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

export async function GET(req, { params }) {
  const { file } = params;
  const filePath = join(resolve("uploads"), file);

  if (existsSync(filePath)) {
    const fileExt = extname(filePath).toLowerCase();
    const contentType = getContentType(fileExt);
    const fileStream = createReadStream(filePath);

    return new NextResponse(fileStream, {
      headers: { "Content-Type": contentType },
    });
  }

  return new NextResponse("File not found", { status: 404 });
}

