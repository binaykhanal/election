import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("upload") || formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");
    const uploadPath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(uploadPath, buffer);

    // Return API URL for the file
    return NextResponse.json({
      url: `/api/upload/file/${filename}`,
      name: filename,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const files = await fs.readdir(UPLOAD_DIR);

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => ({
        url: `/api/upload/file/${file}`,
        name: file,
      }));

    return NextResponse.json(images);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}

export async function DELETE(req) {
  try {
    const { filename } = await req.json();
    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided" },
        { status: 400 },
      );
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
