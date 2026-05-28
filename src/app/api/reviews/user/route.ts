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
    const reviews = await db.review.findByUserId(session.user.id);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("GET User Reviews Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Missing reviewId" },
        { status: 400 }
      );
    }

    const result = await db.review.deleteById(reviewId, session.user.id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Review not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("DELETE Review Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
