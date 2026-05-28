"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  GraduationCap, GitCompare, LayoutDashboard, Search, LogIn, LogOut,
  UserPlus, Menu, X, Bookmark, ChevronDown, User
} from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const compareColleges = useCompareStore((state) => state.colleges);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/colleges", label: "Colleges", icon: Search },
    { href: "/predictor", label: "Predictor", icon: LayoutDashboard },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50 w-full px-6 py-3.5 shadow-lg shadow-slate-200/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group shrink-0">
          <GraduationCap className="h-8 w-8 text-indigo-500 transition-transform group-hover:scale-110 duration-200" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            CampusIQ
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-slate-900 ${
                isActive(href) ? "text-indigo-600 font-semibold" : "text-slate-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}

          {/* Compare Link */}
          <Link
            href="/compare"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-slate-900 ${
              isActive("/compare") ? "text-indigo-600 font-semibold" : "text-slate-600"
            }`}
          >
            <div className="relative">
              <GitCompare className="h-4 w-4" />
              {compareColleges.length > 0 && (
                <span className="absolute -top-2 -right-2.5 flex h-4 w-4 items-center justify-center bg-indigo-600 text-[10px] text-white rounded-full font-bold">
                  {compareColleges.length}
                </span>
              )}
            </div>
            <span>Compare</span>
          </Link>
        </nav>

        {/* Right Side: Auth */}
        <div className="hidden md:flex items-center space-x-3">
          {compareColleges.length > 0 && (
            <Link
              href="/compare"
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 hover:border-indigo-200 transition-all"
            >
              <span>Comparing {compareColleges.length}</span>
            </Link>
          )}

          {status === "loading" ? (
            <div className="h-8 w-24 shimmer rounded-lg" />
          ) : session ? (
            /* Authenticated: Avatar + Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {session.user?.image ? (
                  <div className="relative h-8 w-8 rounded-full border border-slate-300 overflow-hidden shrink-0">
                    <Image fill src={session.user.image} alt={session.user.name || "User"} className="object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white text-sm">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden lg:inline text-sm font-medium text-slate-800 max-w-[120px] truncate">
                  {session.user?.name}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-200/60 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 truncate">{session.user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                    My Dashboard
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Bookmark className="h-4 w-4 text-sky-400" />
                    Saved Colleges
                  </Link>
                  <div className="border-t border-slate-200 mt-1 pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-100 transition-colors w-full text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not authenticated */
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center space-x-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-sky-500 hover:opacity-90 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/10"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Slide-Down Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-3 border-t border-slate-200 pt-4 pb-2 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(href) ? "text-indigo-600 bg-indigo-50 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          <Link
            href="/compare"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive("/compare") ? "text-indigo-600 bg-indigo-50 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <div className="relative">
              <GitCompare className="h-4 w-4" />
              {compareColleges.length > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center bg-indigo-600 text-[8px] text-white rounded-full font-bold">
                  {compareColleges.length}
                </span>
              )}
            </div>
            Compare {compareColleges.length > 0 && `(${compareColleges.length})`}
          </Link>

          <div className="border-t border-slate-200 pt-3 mt-2 space-y-1">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {session.user?.image ? (
                    <div className="relative h-8 w-8 rounded-full border border-slate-300 overflow-hidden shrink-0">
                      <Image fill src={session.user.image} alt="" className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{session.user?.name}</p>
                    <p className="text-[11px] text-slate-500">{session.user?.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-100 w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3">
                <Link href="/login" className="flex-1 text-center text-sm font-medium text-slate-600 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-sky-500 text-white py-2.5 rounded-xl transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
