import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Content } from "@/models";

export async function GET() {
  try {
    await connectDB();

    const settings = await Content.find({ page: "settings" }).lean();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { settings } = await request.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 },
      );
    }

    await Promise.all(
      settings.map((item) =>
        Content.findOneAndUpdate(
          { page: "settings", key: item.key }, 
          {
            page: "settings",
            key: item.key,
            type: item.type || "SETTINGS",
            valueEn: item.valueEn,
            valueNp: item.valueNp,
          },
          {
            upsert: true, 
            new: true,
            runValidators: true,
          },
        ),
      ),
    );

    return NextResponse.json({ message: "Settings updated" });
  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate setting key" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
