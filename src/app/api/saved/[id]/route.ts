import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { id: collegeId } = await params;

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "College ID is required" },
        { status: 400 }
      );
    }

    const result = await db.savedCollege.remove(session.user.id, collegeId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Saved college not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("DELETE Saved College Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove saved college" },
      { status: 500 }
    );
  }
}
