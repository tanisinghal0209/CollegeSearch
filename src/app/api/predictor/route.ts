import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const predictorSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  rank: z.number().int().positive("Rank must be a positive integer"),
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
        // Map frontend branch selections to DB branch names
        if (branches.includes("CS/IT") && res.branch.includes("Computer Science")) return true;
        if (branches.includes("ECE") && res.branch.includes("ECE")) return true;
        if (branches.includes("Mechanical") && res.branch.includes("Mechanical")) return true;
        if (branches.includes("MBBS") && res.branch.includes("MBBS")) return true;
        if (branches.includes("BDS") && res.branch.includes("BDS")) return true;
        if (branches.includes("MBA") && res.branch.includes("MBA")) return true;
        if (branches.includes("PGDM") && res.branch.includes("PGDM")) return true;
        return false;
      });
    }

    // Filter by state if applicable (e.g., Home State quotas)
    if (state && exam === "STATE_CET") {
       rawResults = rawResults.filter((res: any) => res.college.state === state);
    }
    
    const formattedResults = rawResults.map((res: any) => {
      const college = res.college;
      const closing = res.closingRank;
      const diff = closing - rank;
      
      let chance = "Reach";
      if (diff > 1000) chance = "Safe";
      else if (diff >= -500) chance = "Good"; // Give some leeway for 'Good'

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
