"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CollegeCard from "@/components/CollegeCard";
import { CollegeListSkeleton } from "@/components/SkeletonLoader";
import { SlidersHorizontal, Search, RotateCcw, X, GraduationCap, Star } from "lucide-react";
import { College } from "@/lib/mockData";
import { useDebounce } from "@/lib/useDebounce";
import { toast } from "sonner";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-6 py-12 flex-grow">
        <div className="h-10 w-48 shimmer rounded-lg mb-8" />
        <CollegeListSkeleton count={6} />
      </div>
    }>
      <CollegesSearchPage />
    </Suspense>
  );
}

const INDIAN_STATES = [
  "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Rajasthan",
  "Gujarat", "West Bengal", "Telangana", "Uttar Pradesh", "Madhya Pradesh",
  "Kerala", "Andhra Pradesh", "Punjab", "Haryana", "Bihar"
];

const EXAM_OPTIONS = ["JEE Main", "JEE Advanced", "CAT", "NEET", "State CET", "CUET"];
const TYPE_OPTIONS = ["Government", "Private", "Deemed"];

function CollegesSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Filters State — synced from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedStates, setSelectedStates] = useState<string[]>(searchParams.getAll("state"));
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedExams, setSelectedExams] = useState<string[]>(searchParams.getAll("exam"));
  const [minFees, setMinFees] = useState(Number(searchParams.get("minFees")) || 50000);
  const [maxFees, setMaxFees] = useState(Number(searchParams.get("maxFees")) || 2500000);
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "ranking");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 12;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Build URL params helper
  const buildParams = () => {
    const p = new URLSearchParams();
    if (debouncedSearch) p.set("search", debouncedSearch);
    selectedStates.forEach(s => p.append("state", s));
    if (selectedType) p.set("type", selectedType);
    selectedExams.forEach(e => p.append("exam", e));
    if (minFees > 50000) p.set("minFees", minFees.toString());
    if (maxFees < 2500000) p.set("maxFees", maxFees.toString());
    if (minRating > 0) p.set("minRating", minRating.toString());
    if (sortBy !== "ranking") p.set("sortBy", sortBy);
    if (page > 1) p.set("page", page.toString());
    return p;
  };

  // Update URL when filters change
  useEffect(() => {
    const p = buildParams();
    router.replace(`/colleges${p.toString() ? "?" + p.toString() : ""}`, { scroll: false });
  }, [debouncedSearch, selectedStates, selectedType, selectedExams, minFees, maxFees, minRating, sortBy, page]);

  // Reset page to 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, selectedStates, selectedType, selectedExams, minFees, maxFees, minRating, sortBy]);

  // Fetch colleges
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["colleges", debouncedSearch, selectedStates, selectedType, selectedExams, minFees, maxFees, minRating, sortBy, page],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (debouncedSearch) p.set("search", debouncedSearch);
      if (selectedStates.length === 1) p.set("state", selectedStates[0]);
      if (selectedType) p.set("type", selectedType);
      selectedExams.forEach(e => p.append("exam", e));
      if (minFees > 50000) p.set("minFees", minFees.toString());
      if (maxFees < 2500000) p.set("maxFees", maxFees.toString());
      if (minRating > 0) p.set("minRating", minRating.toString());
      p.set("sortBy", sortBy);
      p.set("page", page.toString());
      p.set("limit", limit.toString());
      const res = await fetch(`/api/colleges?${p.toString()}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    }
  });

  const colleges: College[] = apiData?.data?.colleges || [];
  const total = apiData?.data?.total || 0;
  const totalPages = apiData?.data?.totalPages || 1;

  // Favorites
  const { data: savedIds = [] } = useQuery<string[]>({
    queryKey: ["savedIds", session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const res = await fetch("/api/saved");
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map((c: any) => c.id);
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
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save college");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedIds", session?.user?.id] });
      toast.success("Saved colleges updated");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save college");
    }
  });

  const handleFavoriteToggle = (collegeId: string) => favoriteMutation.mutate(collegeId);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStates([]);
    setSelectedType("");
    setSelectedExams([]);
    setMinFees(50000);
    setMaxFees(2500000);
    setMinRating(0);
    setSortBy("ranking");
    setPage(1);
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]);
  };

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]);
  };

  const savedSet = new Set(savedIds);

  // ── Filter Sidebar Content (shared between desktop & mobile) ──
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Keyword</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="College name, course..."
            className="w-full glass-input pl-9 pr-4 py-2.5 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* State checkboxes */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">State / Location</label>
        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
          {INDIAN_STATES.map(state => (
            <label key={state} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStates.includes(state)}
                onChange={() => toggleState(state)}
                className="accent-indigo-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type radio group */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College Type</label>
        <div className="grid grid-cols-3 gap-1.5">
          {TYPE_OPTIONS.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={`py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedType === type
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Exam checkboxes */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exam Accepted</label>
        <div className="space-y-1.5">
          {EXAM_OPTIONS.map(exam => (
            <label key={exam} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedExams.includes(exam)}
                onChange={() => toggleExam(exam)}
                className="accent-indigo-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{exam}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fees Range */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Fees Range: <span className="text-indigo-600 font-semibold">₹{(minFees/100000).toFixed(1)}L – ₹{(maxFees/100000).toFixed(1)}L</span>
        </label>
        <div className="space-y-2">
          <input
            type="range" min={50000} max={2500000} step={50000} value={minFees}
            onChange={(e) => setMinFees(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
          <input
            type="range" min={50000} max={2500000} step={50000} value={maxFees}
            onChange={(e) => setMaxFees(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
          <span>₹50K</span><span>₹25L</span>
        </div>
      </div>

      {/* Min Rating */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Rating</label>
        <div className="flex items-center space-x-1">
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex-grow py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                minRating === r
                  ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              {r === 0 ? "Any" : (
                <span className="flex items-center justify-center gap-0.5">
                  {r}<Star className="h-2.5 w-2.5 fill-current" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      <button
        onClick={handleResetFilters}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-slate-200/50 bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-grow flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-500" />
            Discover Colleges
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <span className="text-slate-900 font-semibold">{colleges.length}</span> of{" "}
            <span className="text-slate-900 font-semibold">{total}</span> colleges
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 flex-1"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 w-full sm:w-52 cursor-pointer"
          >
            <option value="ranking">Sort: National Rank</option>
            <option value="rating">Sort: User Rating</option>
            <option value="fees-asc">Fees: Low → High</option>
            <option value="fees-desc">Fees: High → Low</option>
          </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[280px] shrink-0 glass-card p-6 rounded-2xl sticky top-24 border border-slate-200 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              Filters
            </h2>
          </div>
          {FilterContent()}
        </aside>

        {/* Results Grid */}
        <div className="flex-grow w-full min-w-0">
          {isLoading ? (
            <CollegeListSkeleton count={6} />
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {colleges.map((college: College) => (
                <div key={college.id} className="h-full">
                  <CollegeCard
                    college={college}
                    isFavorited={savedSet.has(college.id)}
                    onToggleFavorite={handleFavoriteToggle}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-16 rounded-2xl text-center flex flex-col items-center justify-center space-y-4 border border-slate-200">
              <GraduationCap className="h-14 w-14 text-slate-600" />
              <h3 className="text-xl font-bold text-slate-800">No Colleges Found</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                No colleges match your current filters. Try adjusting your search criteria.
              </p>
              <button onClick={handleResetFilters} className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) { pageNum = i + 1; }
                else if (page <= 4) { pageNum = i + 1; }
                else if (page >= totalPages - 3) { pageNum = totalPages - 6 + i; }
                else { pageNum = page - 3 + i; }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                        : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative ml-auto w-[320px] max-w-full bg-white border-l border-slate-200 h-full overflow-y-auto z-10">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                Filters
              </h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {FilterContent()}
            </div>
            <div className="sticky bottom-0 px-6 py-4 bg-white/95 backdrop-blur-sm border-t border-slate-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-sm font-semibold text-white py-3 rounded-xl transition-all cursor-pointer"
              >
                Show Results ({total})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
