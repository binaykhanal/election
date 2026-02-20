import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Program } from "@/models/index";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit")) || 20;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const programs = await Program.find({
      date: { $gte: today },
    })
      .sort({ date: 1 })
      .limit(limit);

    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const data = await req.json();
    const newProgram = await Program.create(data);
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 400 });
  }
}
