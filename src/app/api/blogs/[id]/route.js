import { NextResponse } from "next/server";
import { Blog } from "@/models";

export async function GET(request, { params }) {
  try {
    // 1. Await the params!
    const { id } = await params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // 2. Await here too!
    const data = await request.json();
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await blog.update(data);
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // 3. And here!
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await blog.destroy();
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
