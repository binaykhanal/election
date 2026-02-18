import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/server/db";
import { Content } from "@/models";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const content = await Content.findById(id).lean();

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("GET ID Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const data = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      {
        page: data.page,
        key: data.key,
        type: data.type,
        valueEn: data.valueEn,
        valueNp: data.valueNp,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContent) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("PUT Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key for this page." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Content.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
