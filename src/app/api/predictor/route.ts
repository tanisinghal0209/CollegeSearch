import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const predictorSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  rank: z.number().positive("Rank must be positive"),
  category: z.string().default("GENERAL"),
  branches: z.array(z.string()).optional(),
  state: z.string().optional()
});

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  const rate = rateLimit.get(ip);
  if (rate) {
    if (now > rate.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (rate.count >= maxRequests) {
      return NextResponse.json({ success: false, error: "Too many requests, please try again later." }, { status: 429 });
    } else {
      rate.count += 1;
    }
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
  }

  try {
    const body = await request.json();
    const parsedData = predictorSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { exam, rank, category, branches, state } = parsedData.data;

    let rawResults = await db.predictor.predict(exam, category, rank);
    
    // Filter by branches if the user selected any
    if (branches && branches.length > 0) {
      rawResults = rawResults.filter((res: any) => {
        return branches.some(b => {
          if (b === "CS/IT" && (res.branch.includes("Computer Science") || res.branch.includes("Information Technology"))) return true;
          if (b === "Other") return true;
          return res.branch.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(res.branch.toLowerCase());
        });
      });
    }

    // Filter by state if applicable (e.g., Home State quotas)
    if (state && exam === "STATE_CET") {
       rawResults = rawResults.filter((res: any) => res.college.state === state);
    }
    
    const isScoreBased = exam === "CUET" || exam === "BITSAT" || exam === "CAT";

    const formattedResults = rawResults.map((res: any) => {
      const college = res.college;
      const closing = res.closingRank;
      
      let diff = isScoreBased ? (rank - closing) : (closing - rank);
      
      let chance = "Reach";
      if (isScoreBased) {
        if (exam === "CAT") {
          if (diff >= 1.0) chance = "Safe";
          else if (diff >= 0) chance = "Good";
        } else if (exam === "BITSAT") {
          if (diff >= 15) chance = "Safe";
          else if (diff >= -5) chance = "Good";
        } else { // CUET
          if (diff >= 20) chance = "Safe";
          else if (diff >= -5) chance = "Good";
        }
      } else {
        if (diff > 1000) chance = "Safe";
        else if (diff >= -500) chance = "Good"; // Give some leeway for 'Good'
      }

      return {
        id: res.id,
        collegeName: college.name,
        slug: college.slug,
        location: `${college.city}, ${college.state}`,
        branch: res.branch,
        openingRank: res.openingRank,
        closingRank: closing,
        fees: college.fees?.max || 0,
        chanceLabel: chance,
        ranking: college.ranking
      };
    });

    return NextResponse.json({ success: true, data: formattedResults });
  } catch (error) {
    console.error("Predictor API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
