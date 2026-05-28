"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { 
  Star, MapPin, DollarSign, Users, Award, Landmark, 
  BookOpen, ChevronRight, MessageSquare, AlertCircle, 
  Send, Bookmark, GitCompare, Briefcase, Calendar
} from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";
import { College } from "@/lib/mockData";

const reviewFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function CollegeDetailPageWrapper() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-6 py-12 flex-grow space-y-8 animate-pulse">
        <div className="h-64 w-full bg-white rounded-2xl" />
        <div className="h-10 w-1/3 bg-white rounded" />
        <div className="h-40 w-full bg-white rounded" />
      </div>
    }>
      <CollegeDetailPage />
    </Suspense>
  );
}

function CollegeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { colleges: compareColleges, addCollege, removeCollege } = useCompareStore();

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { title: "", body: "", pros: "", cons: "" }
  });

  const { data: college, isLoading, isError } = useQuery<College>({
    queryKey: ["college", slug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}`);
      if (!res.ok) throw new Error("College not found");
      const json = await res.json();
      return json.data;
    }
  });

  const { data: favorites = [] } = useQuery<College[]>({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const res = await fetch("/api/saved");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!session
  });

  const favoriteMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", session?.user?.id] });
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      const res = await fetch(`/api/colleges/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, rating })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post review");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college", slug] });
      reset();
      setRating(5);
      toast.success("Review posted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred");
    }
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 flex-grow space-y-8">
        <div className="h-64 w-full shimmer rounded-3xl" />
        <div className="h-10 w-1/3 shimmer rounded-xl" />
        <div className="h-40 w-full shimmer rounded-2xl" />
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-14 w-14 text-rose-500" />
        <h2 className="text-2xl font-bold text-slate-900">Profile Not Found</h2>
        <p className="text-slate-700 text-sm">
          The college profile you are trying to view does not exist in our registry database.
        </p>
        <button onClick={() => router.push("/colleges")} className="bg-indigo-600 text-white font-semibold text-xs px-5 py-3 rounded-xl hover:opacity-90 transition-all">
          Return to Registry
        </button>
      </div>
    );
  }

  const isFavorited = favorites.some((f) => f.id === college.id);
  const isComparing = compareColleges.some((c) => c.id === college.id);

  const handleFavoriteToggle = () => {
    if (!session) {
      alert("Please sign in to save colleges.");
      return;
    }
    favoriteMutation.mutate(college.id);
  };

  const handleCompareToggle = () => {
    if (isComparing) {
      removeCollege(college.id);
    } else {
      if (compareColleges.length >= 3) {
        alert("You can compare a maximum of 3 colleges side-by-side.");
        return;
      }
      addCollege(college);
    }
  };

  const onSubmitReview = (values: ReviewFormValues) => reviewMutation.mutate(values);

  return (
    <div className="w-full flex-grow pb-16 bg-slate-50">
      <div className="relative h-72 md:h-96 w-full">
        <Image
          src={college.bannerUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80"}
          alt={college.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-8">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border border-slate-300 p-2 overflow-hidden shrink-0 flex items-center justify-center">
                <Image fill src={college.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&q=80"} alt={college.name} className="object-contain" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200/60">
                    {college.type} Institution
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 border border-amber-200 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-505 text-amber-500" />
                    {typeof college.rating === 'number' ? college.rating.toFixed(1) : "0.0"} Stars
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-none">
                  {college.name}
                </h1>
                <p className="text-slate-700 text-xs md:text-sm flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  {college.city}, {college.state} — <a href={college.website || undefined} target="_blank" className="hover:underline text-indigo-600 font-medium">{(college.website || "").replace("https://", "")}</a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={handleFavoriteToggle} className={`flex-grow md:flex-grow-0 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${isFavorited ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"}`}>
                <Bookmark className={`h-4 w-4 ${isFavorited ? "fill-rose-600 text-rose-600" : ""}`} />
                <span>{isFavorited ? "Saved to Favorites" : "Add to Favorites"}</span>
              </button>
              <button onClick={handleCompareToggle} className={`flex items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ${isComparing ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"}`} title={isComparing ? "Remove from Compare" : "Add to Compare"}>
                <GitCompare className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="flex border-b border-slate-200 space-x-6 overflow-x-auto pb-px">
            {(["overview", "courses", "placements", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-semibold tracking-wide border-b-2 capitalize transition-all whitespace-nowrap cursor-pointer ${activeTab === tab ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-700 hover:text-slate-900"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">About the Institution</h2>
                <p className="text-slate-700 text-sm leading-relaxed">{college.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-slate-700 text-[10px] uppercase font-bold tracking-wider">National Rank</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">#{college.ranking}</p>
                </div>
                <div>
                  <p className="text-slate-700 text-[10px] uppercase font-bold tracking-wider">Established</p>
                  <p className="text-2xl font-bold text-sky-600 mt-1">{college.established || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-700 text-[10px] uppercase font-bold tracking-wider">Placement Rate</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{college.placements?.placementRate || 0}%</p>
                </div>
                <div>
                  <p className="text-slate-700 text-[10px] uppercase font-bold tracking-wider">Reviews</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{college.reviewCount || 0}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Campus Facilities</h3>
                <div className="flex flex-wrap gap-2.5">
                  {(college.facilities || []).map((facility, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Available Courses & Fees
              </h2>
              <div className="space-y-4">
                {college.courses?.map((course: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-200 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                      <p className="text-xs text-slate-700 mt-1">Duration: {course.duration} Years • Seats: {course.seats}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-emerald-600">₹{(course.fees || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-700 uppercase tracking-wide">Total Fees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Placement Records
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Average Salary</h3>
                  <p className="text-3xl font-extrabold text-slate-900">₹{((college.placements?.averageSalary || 0) / 100000).toFixed(1)}L</p>
                  <span className="text-[10px] text-slate-700 font-semibold mt-4">Per annum</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Highest Salary</h3>
                  <p className="text-3xl font-extrabold text-slate-900">₹{((college.placements?.highestSalary || 0) / 100000).toFixed(1)}L</p>
                  <span className="text-[10px] text-slate-700 font-semibold mt-4">Per annum</span>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Top Recruiters</h3>
                <div className="flex flex-wrap gap-2.5">
                  {(college.placements?.topRecruiters || []).map((recruiter: string, i: number) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-600">
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" /> Submit a Review
                </h2>
                {session ? (
                  <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Your Rating</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star} type="button" onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(null)}
                            className="p-1 hover:scale-110 transition-transform duration-100 cursor-pointer"
                          >
                            <Star className={`h-7 w-7 ${star <= (hoverRating ?? rating) ? "fill-amber-500 text-amber-500" : "text-slate-700"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <input type="text" {...register("title")} placeholder="Review Headline" className="w-full glass-input px-4 py-2.5 text-xs rounded-xl" />
                      {errors.title && <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <textarea {...register("body")} rows={4} placeholder="Detailed Review Content" className="w-full glass-input px-4 py-2.5 text-xs rounded-xl" />
                      {errors.body && <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.body.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" {...register("pros")} placeholder="Pros" className="w-full glass-input px-4 py-2.5 text-xs rounded-xl" />
                       <input type="text" {...register("cons")} placeholder="Cons" className="w-full glass-input px-4 py-2.5 text-xs rounded-xl" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-semibold px-5 py-3 rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/15 flex items-center space-x-1.5 disabled:opacity-50 transition-all cursor-pointer">
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-white/40 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-slate-700 text-xs">You must be signed in to submit a review.</p>
                    <button onClick={() => router.push("/login")} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                      Sign In Now
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Verified Reviews ({college.reviews?.length || 0})</h3>
                {college.reviews && college.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {college.reviews.map((rev: any) => (
                      <div key={rev.id} className="glass-card p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            {rev.userImage ? (
                              <div className="relative h-8 w-8 rounded-full border border-slate-200 overflow-hidden">
                                <Image fill src={rev.userImage} alt={rev.userName} className="object-cover" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-900 text-xs">{rev.userName[0].toUpperCase()}</div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{rev.userName}</p>
                              <p className="text-[10px] text-slate-700">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px] font-bold text-amber-700">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">{rev.body || rev.content}</p>
                        </div>
                        {(rev.pros || rev.cons) && (
                          <div className="grid grid-cols-2 gap-4 mt-2">
                             {rev.pros && <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-xl">Pros: {rev.pros}</div>}
                             {rev.cons && <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-xl">Cons: {rev.cons}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 rounded-2xl text-center text-slate-700 text-xs">No reviews yet. Be the first to share your experience!</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-3">Fast Facts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Institution Type</span>
                <span className="font-semibold text-slate-800">{college.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Established</span>
                <span className="font-semibold text-slate-800">{college.established || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Placement Rate</span>
                <span className="font-semibold text-slate-800">{college.placements?.placementRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Average Salary</span>
                <span className="font-semibold text-emerald-600">₹{((college.placements?.averageSalary || 0) / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Website URL</span>
                <a href={college.website || undefined} target="_blank" className="font-semibold text-indigo-600 hover:underline flex items-center">
                  <span>Visit Site</span> <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Compare {college.name}</h4>
            <p className="text-slate-700 text-xs leading-relaxed">Add this college to your active deck and review side-by-side matrices against other research platforms.</p>
            <button onClick={handleCompareToggle} className={`w-full text-xs font-semibold py-2.5 rounded-xl border transition-all cursor-pointer ${isComparing ? "bg-indigo-50 border border-indigo-200 text-indigo-600" : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"}`}>
              {isComparing ? "Remove from Comparison" : "Add to Comparison Deck"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
