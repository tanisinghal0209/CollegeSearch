"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Loader2, Target, Search, MapPin, Award, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { College } from "@/lib/mockData";

import { BookOpen, GraduationCap, Briefcase, Stethoscope } from "lucide-react";

const EXAMS = [
  {
    key: "JEE_MAIN",
    name: "JEE Main",
    icon: BookOpen,
    desc: "For BTech/BE admissions in NITs, IIITs, CFTIs, and top state colleges."
  },
  {
    key: "JEE_ADVANCED",
    name: "JEE Advanced",
    icon: GraduationCap,
    desc: "For IIT admissions. Only top JEE Main rankers eligible."
  },
  {
    key: "CAT",
    name: "CAT",
    icon: Briefcase,
    desc: "For MBA/PGDM admissions in IIMs and top B-schools."
  },
  {
    key: "NEET",
    name: "NEET",
    icon: Stethoscope,
    desc: "For MBBS/BDS/medical admissions in India."
  },
  {
    key: "STATE_CET",
    name: "State CET",
    icon: MapPin,
    desc: "For state-level engineering/medical entrance."
  }
];

const CATEGORIES = ["GENERAL", "OBC", "SC", "ST", "EWS"];
const STATES = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Other"];

function PredictorContent() {
  const searchParams = useSearchParams();
  const initialExam = searchParams.get('exam') || "JEE_MAIN";
  const initialRank = searchParams.get('rank') || "";

  const [step, setStep] = useState(1);
  const [exam, setExam] = useState(initialExam);
  const [rank, setRank] = useState(initialRank);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [branches, setBranches] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const AVAILABLE_BRANCHES = exam === "NEET" ? ["MBBS", "BDS", "Other"] : exam === "CAT" ? ["MBA", "PGDM", "Other"] : ["CS/IT", "ECE", "Mechanical", "Civil", "Other"];

  // Reset branches when exam changes
  useEffect(() => {
    setBranches([]);
  }, [exam]);
  const [tab, setTab] = useState("all");
  const [sortBy, setSortBy] = useState("ranking");

  useEffect(() => {
    if (initialRank) {
      handlePredict();
    }
  }, []);

  const handleExamSelect = (key: string) => {
    setExam(key);
    setStep(2);
  };

  const handleBranchToggle = (branch: string) => {
    setBranches(branches.includes(branch)
      ? branches.filter((b) => b !== branch)
      : [...branches, branch]);
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rank) return;

    setLoading(true);
    
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank.replace(/,/g, "")),
          category,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank.replace(/,/g, "")),
          category,
          branches,
          state
        })
      });
      const data = await res.json();
      setResults(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-indigo-50 to-slate-100 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
              <Target className="h-8 w-8 text-indigo-600" />
              Admission Predictor
            </h1>
            <p className="text-slate-500">Discover colleges where you have a strong chance of admission based on historical cutoff trends.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar Form */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white/[0.02]">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Enter Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Step 1: Exam Select */}
                {step === 1 && (
                  <div className="grid grid-cols-1 gap-4">
                    {EXAMS.map((ex) => (
                      <button
                        type="button"
                        key={ex.key}
                        onClick={() => handleExamSelect(ex.key)}
                        className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-indigo-50 transition shadow group"
                      >
                        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                          <ex.icon className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600">{ex.name}</span>
                          <span className="text-xs text-slate-500 mt-1 text-left">{ex.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {/* Step 2: Details */}
                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Your Rank</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        value={rank}
                        onChange={(e) => setRank(e.target.value.replace(/[^0-9,]/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))}
                        placeholder="e.g. 12,450"
                        className="glass-input w-full px-4 py-2 rounded-lg text-lg font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                      <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${category === cat ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Preferred Branch(es)</label>
                      <div className="flex gap-2 flex-wrap">
                        {AVAILABLE_BRANCHES.map((branch) => (
                          <button
                            type="button"
                            key={branch}
                            onClick={() => handleBranchToggle(branch)}
                            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${branches.includes(branch) ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                          >
                            {branch}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Home State (for quota)</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="glass-input w-full px-4 py-2 rounded-lg"
                        required
                      >
                        <option value="">Select State</option>
                        {STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                      Predict My Colleges
                    </button>
                    <button
                      type="button"
                      className="text-xs text-slate-500 underline mt-2"
                      onClick={() => setStep(1)}
                    >
                      ← Change Exam
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">
                {results.length > 0 ? `Found ${results.length} colleges matching your profile` : "Results"}
              </h2>
              {results.length > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-input px-3 py-2 rounded-lg text-xs"
                >
                  <option value="ranking">Sort: Ranking</option>
                  <option value="closingRank">Sort: Closing Rank</option>
                  <option value="fees">Sort: Fees</option>
                </select>
              )}
            </div>
            {/* Filter Tabs */}
            {results.length > 0 && (
              <div className="flex gap-2 mb-4">
                <button
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${tab === "all" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                  onClick={() => setTab("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${tab === "safe" ? "bg-green-50 border-green-200 text-green-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                  onClick={() => setTab("safe")}
                >
                  Safe Picks 🟢
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${tab === "good" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                  onClick={() => setTab("good")}
                >
                  Good Chance 🟡
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${tab === "reach" ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"}`}
                  onClick={() => setTab("reach")}
                >
                  Reach 🔴
                </button>
              </div>
            )}
            {/* Results List */}
            <div className="grid grid-cols-1 gap-4">
              {loading && <div className="text-slate-500">Loading...</div>}
              {!loading && results.length === 0 && (
                <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No colleges found. Try relaxing your filters.</div>
              )}
              {!loading && results.length > 0 && results
                .filter((r) => {
                  if (tab === "safe") return r.chanceLabel === "Safe";
                  if (tab === "good") return r.chanceLabel === "Good";
                  if (tab === "reach") return r.chanceLabel === "Reach";
                  return true;
                })
                .sort((a, b) => {
                  if (sortBy === "ranking") return a.ranking - b.ranking;
                  if (sortBy === "closingRank") return b.closingRank - a.closingRank;
                  if (sortBy === "fees") return a.fees - b.fees;
                  return 0;
                })
                .map((res) => (
                  <div key={res.id + res.branch} className="glass-card flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                      <div>
                        <div className="font-semibold text-base text-slate-900">{res.collegeName}</div>
                        <div className="text-xs text-slate-500">{res.location} • {res.branch}</div>
                      </div>
                      <div className="flex gap-4 text-xs mt-2 md:mt-0">
                        <div className="bg-slate-200 px-2 py-1 rounded-lg">Open: <span className="font-bold text-slate-900">{res.openingRank}</span></div>
                        <div className="bg-slate-200 px-2 py-1 rounded-lg">Close: <span className="font-bold text-slate-900">{res.closingRank}</span></div>
                        <div className="bg-slate-200 px-2 py-1 rounded-lg">Fees: <span className="font-bold text-slate-900">₹{res.fees?.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.chanceLabel === "Safe" ? "bg-green-50 text-green-600 border border-green-200" : res.chanceLabel === "Good" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>{res.chanceLabel}</span>
                      <Link href={`/colleges/${res.slug}`} className="ml-2 text-indigo-600 underline text-xs font-semibold">View College</Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PredictorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <PredictorContent />
    </Suspense>
  );
}
