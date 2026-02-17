import { NextResponse } from "next/server";
import { Content } from "@/models";

export async function GET() {
  try {
    const settings = await Content.findAll({
      where: { page: "settings" },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { settings } = await request.json();

    await Promise.all(
      settings.map((item) =>
        Content.upsert({
          page: "settings",
          key: item.key,
          type: item.type || "SETTINGS",
          valueEn: item.valueEn,
          valueNp: item.valueNp,
        }),
      ),
    );

    return NextResponse.json({ message: "Settings updated" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
