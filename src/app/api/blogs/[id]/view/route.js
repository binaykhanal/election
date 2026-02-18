import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/server/db";
import { Blog } from "@/models";

export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: false },
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View increment error:", error);

    return NextResponse.json({ error: "Increment failed" }, { status: 500 });
  }
}
