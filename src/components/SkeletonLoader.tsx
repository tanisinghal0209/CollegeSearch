import React from "react";

export function CollegeCardSkeleton() {
  return (
    <div className="glass-card flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
      {/* Top cover image skeleton */}
      <div className="h-48 w-full shimmer" />
      
      {/* Details skeleton */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          {/* Badge skeleton */}
          <div className="h-4 w-16 shimmer rounded" />
          {/* Title skeleton */}
          <div className="h-6 w-3/4 shimmer rounded" />
          {/* Subtitle skeleton */}
          <div className="h-4 w-1/2 shimmer rounded" />
        </div>

        {/* Specs grid skeleton */}
        <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-white/5">
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded" />
            <div className="h-4 w-20 shimmer rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded" />
            <div className="h-4 w-16 shimmer rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded" />
            <div className="h-4 w-20 shimmer rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded" />
            <div className="h-4 w-16 shimmer rounded" />
          </div>
        </div>

        {/* Button skeletons */}
        <div className="flex gap-2">
          <div className="h-10 flex-grow shimmer rounded-xl" />
          <div className="h-10 w-10 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CollegeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <CollegeCardSkeleton key={idx} />
      ))}
    </div>
  );
}
