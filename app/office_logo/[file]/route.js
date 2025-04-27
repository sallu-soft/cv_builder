import { NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs"; // Ensure using Node.js runtime

const getContentType = (fileName) => {
  const extension = fileName.split(".").pop();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  return mimeTypes[extension] || "application/octet-stream";
};

export async function GET(req, { params }) {
  const { file } = params;
  const filePath = join(process.cwd(), "office_logo", file); // 🔥 Use office_logo

  try {
    const imageBuffer = await fs.readFile(filePath);
    const contentType = getContentType(file);

    return new Response(imageBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}