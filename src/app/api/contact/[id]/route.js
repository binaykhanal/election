import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/server/db";
import { Inquiry } from "@/models";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    inquiry.isRead = !inquiry.isRead;
    await inquiry.save();

    return NextResponse.json({
      success: true,
      isRead: inquiry.isRead,
    });
  } catch (error) {
    console.error("Update Inquiry Error:", error);

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const { id } = resolvedParams;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Inquiry.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
