import { NextResponse } from "next/server";
import { Inquiry } from "@/models";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updatedInquiry = await inquiry.update({
      isRead: !inquiry.isRead,
    });

    return NextResponse.json({
      success: true,
      isRead: updatedInquiry.isRead,
    });
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = await Inquiry.destroy({
      where: { id },
    });

    if (deleted) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
