import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Content } from "@/models";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "home";

  try {
    await connectDB();

    const contents = await Content.find({ page }).lean();

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Fetch Content Error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { page = "home", key, valueEn, valueNp, type } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const content = await Content.findOneAndUpdate(
      { page, key },
      {
        page,
        key,
        type,
        valueEn,
        valueNp,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Upsert Content Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate content key for this page." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
