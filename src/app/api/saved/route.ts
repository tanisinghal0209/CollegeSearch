import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const saved = await db.savedCollege.findManyByUserId(session.user.id);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("GET Saved Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "Missing collegeId" },
        { status: 400 }
      );
    }

    const result = await db.savedCollege.toggle(session.user.id, collegeId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("POST Toggle Saved Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle saved college" },
      { status: 500 }
    );
  }
}
