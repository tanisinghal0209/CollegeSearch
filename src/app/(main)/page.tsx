"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, TrendingUp, Users, Award, BookOpen, Target, ChevronRight } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import { College } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredColleges, setFeaturedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Predictor State
  const [exam, setExam] = useState("JEE_MAIN");
  const [rank, setRank] = useState("");

  useEffect(() => {
    // Fetch featured (top ranked) colleges
    fetch("/api/colleges?sortBy=ranking")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson?.success && Array.isArray(resJson.data?.colleges)) {
          setFeaturedColleges(resJson.data.colleges.slice(0, 6));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured colleges", err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePredictorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rank) {
      router.push(`/predictor?exam=${exam}&rank=${rank}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 rounded-full filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-400/20 rounded-full filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-sky-400/20 rounded-full filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
                Find Your Perfect College
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Search 500+ top Indian colleges, predict your admission chances with historical cutoffs, and make data-driven decisions for your future.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 md:py-5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md shadow-2xl transition-all text-lg"
                placeholder="Search colleges, courses, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link
              href="/colleges"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Explore Colleges
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/predictor"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Target className="h-4 w-4" />
              Try Predictor
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500"
          >
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-indigo-400"/> 500+ Colleges</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Target className="h-4 w-4 text-purple-400"/> 50+ Exams</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-400"/> 10k+ Reviews</span>
          </motion.div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-20 px-6 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Ranked Colleges</h2>
              <p className="text-slate-500">Discover India's most prestigious institutions.</p>
            </div>
            <Link href="/colleges" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar gap-6">
              {featuredColleges.map((college) => (
                <div key={college.id} className="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0">
                  <CollegeCard college={college} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How CampusIQ Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Your comprehensive journey from searching to securing admission.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Discover</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Explore hundreds of colleges with detailed insights on fees, placements, and campus facilities.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Compare & Predict</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Use our advanced rank predictor to check your admission chances and compare colleges side-by-side.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Make a Decision</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Read authentic student reviews, analyze placement data, and save your top choices to your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Predictor CTA Widget */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 border border-slate-200 p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Know Your Chances <br/> Before You Apply
              </h2>
              <p className="text-slate-600">
                Input your exam and expected rank to see a personalized list of colleges you have a high probability of getting into based on historical cutoffs.
              </p>
            </div>

            <div className="w-full md:w-[400px] glass-card p-6 rounded-2xl bg-white border border-slate-200">
              <form onSubmit={handlePredictorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Exam</label>
                  <select 
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="JEE_MAIN">JEE Main</option>
                    <option value="JEE_ADVANCED">JEE Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="CAT">CAT</option>
                    <option value="BITSAT">BITSAT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Rank</label>
                  <input 
                    type="number"
                    required
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25">
                  Predict Colleges
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
