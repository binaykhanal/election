import { Inquiry } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Inquiry.sync();

    const inquiries = await Inquiry.findAll({
      order: [["createdAt", "DESC"]],
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Fetch Inquiries Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await Inquiry.sync();

    const inquiry = await Inquiry.create({
      name: data.name,
      email: data.email,
      subject: data.subject || "No Subject",
      message: data.message,
      isRead: false,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
