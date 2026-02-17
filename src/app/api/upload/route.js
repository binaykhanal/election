import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");
    const uploadPath = path.join(process.cwd(), "public/uploads", filename);

    await fs.mkdir(path.join(process.cwd(), "public/uploads"), {
      recursive: true,
    });

    await fs.writeFile(uploadPath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: filename,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const files = await fs.readdir(uploadDir);

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => ({
        url: `/uploads/${file}`,
        name: file,
      }));

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json([]); // Return empty if folder doesn't exist yet
  }
}

export async function DELETE(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", url);

    await fs.unlink(filePath);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
