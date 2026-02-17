import { NextResponse } from "next/server";
import { Content } from "@/models";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "home";

  try {
    const contents = await Content.findAll({ where: { page } });
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { page, key, valueEn, valueNp, type } = body;

    const [content, created] = await Content.upsert({
      page,
      key,
      type,
      valueEn,
      valueNp,
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
