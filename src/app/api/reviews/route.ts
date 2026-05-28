import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
  pros: z.string().optional(),
  cons: z.string().optional(),
  batch: z.number().optional(),
  collegeId: z.string().min(1, "College ID is required")
});

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
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      ...parsed.data,
      userId: session.user.id
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
