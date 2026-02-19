import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Program } from "@/models/index";

export async function GET() {
  await connectDB();
  try {
    const programs = await Program.find({}).sort({ date: -1 });
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
