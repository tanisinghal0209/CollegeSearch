import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const college = await db.college.findUnique(slug);
    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: college });
  } catch (error) {
    console.error("GET College Detail Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve college details" },
      { status: 500 }
    );
  }
}
