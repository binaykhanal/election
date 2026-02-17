import { NextResponse } from "next/server";
import { Content } from "@/models";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const content = await Content.findByPk(id);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("GET ID Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const content = await Content.findByPk(id);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    await content.update({
      page: data.page,
      key: data.key,
      type: data.type,
      valueEn: data.valueEn,
      valueNp: data.valueNp,
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const content = await Content.findByPk(id);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    await content.destroy();
    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
