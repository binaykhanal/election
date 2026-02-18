import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Blog } from "@/models";

export async function GET() {
  try {
    await connectDB();

    const totalBlogs = await Blog.countDocuments();

    const publishedBlogs = await Blog.countDocuments({ published: true });

    const result = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const totalViews = result[0]?.totalViews || 0;

    return NextResponse.json({
      total: totalBlogs,
      published: publishedBlogs,
      views: totalViews,
    });
  } catch (error) {
    console.error("Mongo Blog Stats Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
