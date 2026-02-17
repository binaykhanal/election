import { Blog } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blogs = await Blog.findAll({
      order: [["publishedAt", "DESC"]],
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Sequelize Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.titleEn || !data.titleNp) {
      return NextResponse.json(
        { error: "English and Nepali titles are required" },
        { status: 400 },
      );
    }

    const slug = (data.slug || data.titleEn)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blog = await Blog.create({
      titleEn: data.titleEn,
      titleNp: data.titleNp,
      slug: slug,
      contentEn: data.contentEn,
      contentNp: data.contentNp,
      excerptEn: data.excerptEn,
      excerptNp: data.excerptNp,
      featuredImage: data.featuredImage,
      published: data.published || false,
      publishedAt: data.published ? new Date() : null,
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("DETAILED DATABASE ERROR:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return NextResponse.json(
        { error: "A blog with this title/slug already exists." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog", details: error.message },
      { status: 500 },
    );
  }
}
