"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, DollarSign, Users, Award, GitCompare, Bookmark, Briefcase } from "lucide-react";
import { College } from "@/lib/mockData";
import { useCompareStore } from "@/store/useCompareStore";
import { useSession } from "next-auth/react";

interface CollegeCardProps {
  college: College;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function CollegeCard({ college, isFavorited = false, onToggleFavorite }: CollegeCardProps) {
  const { data: session } = useSession();
  const { colleges: compareColleges, addCollege, removeCollege } = useCompareStore();
  
  const isComparing = compareColleges.some((c) => c.id === college.id);
  const compareCount = compareColleges.length;

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
      removeCollege(college.id);
    } else {
      if (compareCount >= 3) {
        alert("You can compare a maximum of 3 colleges side-by-side.");
        return;
      }
      addCollege(college);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to save colleges to your dashboard.");
      return;
    }
    if (onToggleFavorite) {
      onToggleFavorite(college.id);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full rounded-2xl overflow-hidden group border border-slate-200 bg-white/[0.02]">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        <Image
          src={college.bannerUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80"}
          alt={college.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
        
        {/* Rating badge */}
        <div className="absolute top-4 left-4 flex items-center space-x-1 bg-slate-900/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 text-xs font-semibold text-amber-400">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{college.rating.toFixed(1)}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all duration-200 z-10 ${
            isFavorited
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-slate-900/40 border-slate-200/40 text-slate-200 hover:text-white hover:bg-slate-900/60"
          }`}
          aria-label="Add to favorites"
        >
          <Bookmark className={`h-4 w-4 ${isFavorited ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>
      </div>

      {/* Details */}
      <div className="flex-grow p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                {college.type}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                {college.name}
              </h3>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-slate-700 text-xs mb-4">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{college.city}, {college.state}</span>
          </div>

          {/* Specs / Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 border-t border-b border-slate-200 py-4">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-700 uppercase">Avg Fees</p>
                <p className="font-semibold">₹{((college.fees.min + college.fees.max) / 200000).toFixed(1)}L</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Award className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-700 uppercase">National Rank</p>
                <p className="font-semibold">#{college.ranking}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Briefcase className="h-4 w-4 text-sky-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-700 uppercase">Avg Salary</p>
                <p className="font-semibold">₹{(college.placements.averageSalary / 100000).toFixed(1)}L</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Star className="h-4 w-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-700 uppercase">Placement Rate</p>
                <p className="font-semibold">{college.placements.placementRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 mt-auto">
          <Link
            href={`/colleges/${college.slug}`}
            className="flex-grow text-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 py-2.5 rounded-xl transition-all"
          >
            Explore Profile
          </Link>
          <button
            onClick={handleCompareClick}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isComparing
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
            title={isComparing ? "Remove from comparison" : "Add to comparison"}
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
