import { NextResponse } from "next/server";
import { Blog } from "@/models";
import { fn, col } from "sequelize";

export async function GET() {
  try {
    const totalBlogs = await Blog.count();

    const publishedBlogs = await Blog.count({
      where: { published: true },
    });

    let totalViews = 0;
    try {
      totalViews = (await Blog.sum("views")) || 0;
    } catch (e) {
      console.log("Views column not found, defaulting to 0");
    }

    return NextResponse.json({
      total: totalBlogs,
      published: publishedBlogs,
      views: totalViews,
    });
  } catch (error) {
    console.error("Sequelize Stats Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
