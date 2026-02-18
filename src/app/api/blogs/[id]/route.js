import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/server/db";
import { Blog } from "@/models";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Mongo GET Error:", error);

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
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    if (data.titleEn && !data.slug) {
      data.slug = data.titleEn
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Mongo UPDATE Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog with this slug already exists." },
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
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Mongo DELETE Error:", error);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
