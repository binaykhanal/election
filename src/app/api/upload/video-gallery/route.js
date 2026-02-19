import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { GalleryVideo } from "@/models/index";

export async function GET() {
  try {
    await connectDB();
    const videos = await GalleryVideo.find({}).sort({ uploadedAt: -1 });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { titleEn, titleNp, videoUrl } = body;

    if (!titleEn || !videoUrl) {
      return NextResponse.json(
        { error: "Title and Video URL are required" },
        { status: 400 },
      );
    }

    const newVideo = await GalleryVideo.create({
      titleEn,
      titleNp,
      videoUrl,
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Video Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    await GalleryVideo.findByIdAndDelete(id);
    return NextResponse.json({ message: "Video deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
