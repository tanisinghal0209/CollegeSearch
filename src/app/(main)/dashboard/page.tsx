"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CollegeListSkeleton } from "@/components/SkeletonLoader";
import {
  LayoutDashboard, Bookmark, MessageSquare, Star, Trash2,
  ArrowRight, GraduationCap, MapPin, ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { College } from "@/lib/mockData";

export default function DashboardPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"saved" | "reviews">("saved");

  // ── Fetch Saved Colleges ──
  const { data: savedColleges = [], isLoading: savedLoading } = useQuery<College[]>({
    queryKey: ["saved", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/saved");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!session
  });

  // ── Fetch User Reviews ──
  const { data: userReviews = [], isLoading: reviewsLoading } = useQuery<any[]>({
    queryKey: ["userReviews", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/reviews/user");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!session
  });

  // ── Remove Saved College ──
  const removeMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to remove college");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved", session?.user?.id] });
      toast.success("College removed from saved");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove college");
    }
  });

  // ── Delete Review ──
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await fetch(`/api/reviews/user?reviewId=${reviewId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete review");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews", session?.user?.id] });
      toast.success("Review deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete review");
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-grow flex flex-col md:flex-row gap-8 bg-slate-50">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center sticky top-24">
          {session?.user?.image ? (
            <div className="relative h-20 w-20 mb-3">
              <Image
                src={session.user.image}
                alt="Avatar"
                fill
                className="rounded-full border-2 border-indigo-500/50 object-cover"
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="font-bold text-lg text-slate-900">{session?.user?.name || "User"}</div>
          <div className="text-xs text-slate-500 mb-4">{session?.user?.email}</div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 w-full mb-4">
            <div className="bg-slate-100 rounded-xl p-3 text-center border border-slate-200">
              <p className="text-lg font-bold text-indigo-600">{savedColleges.length}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Saved</p>
            </div>
            <div className="bg-slate-100 rounded-xl p-3 text-center border border-slate-200">
              <p className="text-lg font-bold text-amber-700">{userReviews.length}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Reviews</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1.5 w-full">
            <button
              onClick={() => setTab("saved")}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                tab === "saved" ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Saved Colleges
            </button>
            <button
              onClick={() => setTab("reviews")}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                tab === "reviews" ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              My Reviews
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 flex gap-6">
          <button
            onClick={() => setTab("saved")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === "saved" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5"><Bookmark className="h-4 w-4" /> Saved Colleges</span>
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === "reviews" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> My Reviews</span>
          </button>
        </div>

        {/* ── Saved Colleges Tab ── */}
        {tab === "saved" && (
          <div>
            {savedLoading ? (
              <CollegeListSkeleton count={6} />
            ) : savedColleges.length === 0 ? (
              <div className="glass-card p-16 rounded-2xl text-center flex flex-col items-center justify-center space-y-5 border border-slate-200">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <Bookmark className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Saved Colleges</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  You haven&apos;t saved any colleges yet. Browse the directory and click the bookmark icon to save colleges here.
                </p>
                <Link
                  href="/colleges"
                  className="inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  Explore Colleges
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedColleges.map((college: College) => (
                  <div key={college.id} className="glass-card rounded-2xl overflow-hidden border border-slate-200 group">
                    <div className="relative h-36 overflow-hidden bg-slate-200">
                      <Image
                        src={college.bannerUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=250&fit=crop&q=80"}
                        alt={college.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200 text-[11px] font-semibold text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {college.rating?.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">{college.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-indigo-600 shrink-0" />
                          {college.city}, {college.state}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="flex-1 text-center text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 py-2 rounded-lg transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => removeMutation.mutate(college.id)}
                          disabled={removeMutation.isPending}
                          className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                          title="Remove from saved"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── My Reviews Tab ── */}
        {tab === "reviews" && (
          <div>
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-28 shimmer rounded-2xl" />)}
              </div>
            ) : userReviews.length === 0 ? (
              <div className="glass-card p-16 rounded-2xl text-center flex flex-col items-center justify-center space-y-5 border border-slate-200">
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <MessageSquare className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Reviews Yet</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  You haven&apos;t reviewed any colleges yet. Visit a college profile and share your experience.
                </p>
                <Link
                  href="/colleges"
                  className="inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review: any) => (
                  <div key={review.id} className="glass-card p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4">
                    {/* College info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <Link href={`/colleges/${review.collegeSlug}`} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate flex items-center gap-1.5">
                          {review.collegeName}
                          <ExternalLink className="h-3 w-3 text-slate-500 shrink-0" />
                        </Link>
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] font-bold text-amber-700 shrink-0">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {review.rating}
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800">{review.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{review.body}</p>
                      {(review.pros || review.cons) && (
                        <div className="flex gap-2 flex-wrap">
                          {review.pros && <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">+ {review.pros}</span>}
                          {review.cons && <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">- {review.cons}</span>}
                        </div>
                      )}
                      <p className="text-[10px] text-slate-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : ""}
                        {review.batch ? ` • Batch ${review.batch}` : ""}
                      </p>
                    </div>
                    {/* Delete button */}
                    <div className="flex sm:flex-col sm:items-end justify-end gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (confirm("Delete this review?")) {
                            deleteReviewMutation.mutate(review.id);
                          }
                        }}
                        disabled={deleteReviewMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100 bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
