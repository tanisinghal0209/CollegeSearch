"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary caught error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-6">
      <div className="bg-rose-500/10 p-4 rounded-full border border-rose-500/20">
        <AlertCircle className="h-12 w-12 text-rose-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Something went wrong</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          We encountered an unexpected error while trying to load this page. Please try again.
        </p>
        <p className="text-rose-400 text-xs mt-4 bg-rose-500/10 p-2 rounded max-w-lg mx-auto overflow-auto">
          {error.message || "Unknown error"}
        </p>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
