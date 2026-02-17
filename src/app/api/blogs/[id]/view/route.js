import { NextResponse } from "next/server";
import { Blog } from "@/models";

export async function POST(request, { params }) {
  try {
    // 1. Await the params before destructuring
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment views without changing the 'updatedAt' timestamp
    await blog.increment("views", { by: 1, silent: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json({ error: "Increment failed" }, { status: 500 });
  }
}
