import { Metadata, ResolvingMetadata } from "next";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const college = await db.college.findUnique(slug);

  if (!college) {
    return { title: "College Not Found | CampusIQ" };
  }

  return {
    title: `${college.name} - Admissions, Fees, Placements | CampusIQ`,
    description: `Discover everything about ${college.name}, ${college.city}. Read reviews, check cutoffs, courses, fees, and placement records on CampusIQ.`,
    openGraph: {
      title: `${college.name} - Admissions & Placements | CampusIQ`,
      description: college.description,
      images: [college.bannerUrl || ""],
    },
  };
}

export default function CollegeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
