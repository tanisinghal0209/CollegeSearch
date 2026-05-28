import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const collegesQuerySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  type: z.string().optional(),
  exam: z.union([z.string(), z.array(z.string())]).optional(),
  minFees: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
  maxFees: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
  minRating: z.preprocess((v) => (v ? Number(v) : undefined), z.number().optional()),
  sortBy: z.string().optional(),
  page: z.preprocess((v) => (v ? Number(v) : 1), z.number().int().min(1).optional()),
  limit: z.preprocess((v) => (v ? Number(v) : 12), z.number().int().min(1).optional())
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Build plain object for validation
  const raw: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    if (key === 'exam') {
      raw[key] = (raw[key] || []).concat(value);
    } else {
      raw[key] = value;
    }
  });

  const parsed = collegesQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid query parameters', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { search, state, type, exam, minFees, maxFees, minRating, sortBy, page = 1, limit = 12 } = parsed.data;

  try {
    const result = await db.college.findMany({
      search,
      state,
      type,
      exam: Array.isArray(exam) ? exam : exam ? [exam] : undefined,
      minFees,
      maxFees,
      minRating,
      sortBy,
      page,
      limit
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API Fetch Colleges Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve colleges." },
      { status: 500 }
    );
  }
}
