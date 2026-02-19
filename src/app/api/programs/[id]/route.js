import { NextResponse } from "next/server";
import connectDB from "@/lib/server/db";
import { Program } from "@/models/index";

export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const resolvedParams = await params;

    const { id } = resolvedParams;
    const data = await req.json();

    const updatedProgram = await Program.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProgram);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const resolvedParams = await params;

    const { id } = resolvedParams;
    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
