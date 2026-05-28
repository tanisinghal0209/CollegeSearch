import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const stats = await db.college.getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET Stats Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
