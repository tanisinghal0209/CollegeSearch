import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(1000),
  pros: z.string().optional(),
  cons: z.string().optional(),
  batch: z.number().optional()
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const collegeSlug = resolvedParams.slug;

  try {
    const jsonBody = await request.json();
    
    // Zod Validation
    const parsedData = reviewSchema.safeParse(jsonBody);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.issues }, { status: 400 });
    }

    const { rating, title, body, pros, cons, batch } = parsedData.data;

    // We need to resolve collegeId if the param provided is a slug.
    const college = await db.college.findUnique(collegeSlug);
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const newReview = await db.review.create({
      rating,
      title,
      body,
      pros,
      cons,
      batch,
      userId: session.user.id,
      collegeId: college.id // use resolved DB college id
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
