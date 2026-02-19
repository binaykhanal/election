import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { GalleryImage } from "@/models/index.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function GET() {
  await connectDB();

  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 }); // newest first
    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const uploaded = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      const uploadPath = path.join(UPLOAD_DIR, filename);
      await fs.writeFile(uploadPath, buffer);

      const galleryImage = await GalleryImage.create({
        filename,
        url: `/api/upload/file/${filename}`,
      });

      uploaded.push(galleryImage);
    }

    return NextResponse.json(uploaded);
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    const { filename } = await req.json();
    if (!filename)
      return NextResponse.json({ error: "Filename missing" }, { status: 400 });

    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath).catch(() => null);
    await GalleryImage.deleteOne({ filename });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
