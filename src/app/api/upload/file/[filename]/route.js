import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { filename } = resolvedParams;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is missing" },
        { status: 400 },
      );
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 },
    );
  }
}
