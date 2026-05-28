"use client";

import React from "react";
import Link from "next/link";
import { useCompareStore } from "@/store/useCompareStore";
import { 
  GitCompare, Trash2, ArrowLeft, Star, MapPin, 
  DollarSign, Briefcase, Award, BookOpen, Calendar 
} from "lucide-react";

export default function ComparePage() {
  const { colleges, removeCollege, clear } = useCompareStore();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-grow flex flex-col bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-indigo-500" />
            Comparison Deck
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare key parameters side-by-side to determine which university fits your goals.
          </p>
        </div>

        {colleges.length > 0 && (
          <button
            onClick={clear}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-slate-900 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Deck</span>
          </button>
        )}
      </div>

      {colleges.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-5 my-10 border border-slate-200 bg-white/[0.02]">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
            <GitCompare className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your Comparison Deck is Empty</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            You haven't selected any universities to compare yet. Browse the college directory and select the compare option on any profile card.
          </p>
          <Link
            href="/colleges"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-semibold px-5 py-3 rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/15"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Find Colleges</span>
          </Link>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-4 gap-6 bg-slate-100/80 p-6 border border-slate-200 rounded-2xl">
            
            <div className="space-y-8 py-6 pr-4">
              <div className="h-[210px] flex items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">General Information</span>
              </div>
              <div className="space-y-4">
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution Type</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">National Rank</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Established</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fees (Range)</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Salary</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highest Salary</span>
                </div>
                <div className="h-12 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Rate</span>
                </div>
                <div className="h-16 flex items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating & Reviews</span>
                </div>
                <div className="h-20 flex items-start pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Recruiters</span>
                </div>
              </div>
            </div>

            {colleges.map((college: any) => (
              <div key={college.id} className="glass-card rounded-xl p-5 relative flex flex-col justify-between border border-slate-200 bg-white/[0.02]">
                
                <button
                  onClick={() => removeCollege(college.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all z-10"
                  title="Remove from comparison"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="h-[210px] flex flex-col justify-between pb-6 border-b border-slate-200">
                  <div className="space-y-4">
                    <div className="h-14 w-14 bg-white border border-slate-200 p-1.5 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={college.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&q=80"} alt={college.name} className="h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug truncate pr-6">{college.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span>{college.city}, {college.state}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="w-full text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 py-2 rounded-lg transition-all"
                  >
                    View Full Profile
                  </Link>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-600">
                      {college.type}
                    </span>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600">
                    <span>{college.city}, {college.state}</span>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">
                    <div className="flex items-center space-x-1.5">
                      <Award className="h-4 w-4 text-purple-400 shrink-0" />
                      <span>#{college.ranking}</span>
                    </div>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4 text-sky-400 shrink-0" />
                      <span>{college.established || "N/A"}</span>
                    </div>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>₹{(college.fees.min / 100000).toFixed(1)}L - {(college.fees.max / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>₹{(college.placements.averageSalary / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>₹{(college.placements.highestSalary / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="h-12 flex items-center border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Briefcase className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span>{college.placements.placementRate}% Rate</span>
                    </div>
                  </div>
                  <div className="h-16 flex items-center border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="font-bold text-amber-700">{college.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">({college.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="h-20 flex flex-wrap gap-1 items-start pt-2 overflow-y-auto">
                    {college.placements.topRecruiters?.slice(0, 3).map((recruiter: string) => (
                      <span
                        key={recruiter}
                        className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 whitespace-nowrap"
                      >
                        {recruiter}
                      </span>
                    ))}
                    {college.placements.topRecruiters?.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-500 pt-0.5">
                        +{college.placements.topRecruiters.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-8 space-y-3"
              >
                <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                  <GitCompare className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Slot Available</p>
                <Link
                  href="/colleges"
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  Add College
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
