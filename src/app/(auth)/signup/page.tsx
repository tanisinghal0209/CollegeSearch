"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });

  const passwordValue = watch("password");
  const passwordChecks = {
    length: passwordValue?.length >= 8,
    hasUpper: /[A-Z]/.test(passwordValue || ""),
    hasNumber: /[0-9]/.test(passwordValue || "")
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to create account. Please try again.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/colleges");
        router.refresh();
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-6 relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Background effects */}
      <div className="absolute top-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <GraduationCap className="h-10 w-10 text-indigo-500 transition-transform group-hover:scale-110 duration-200" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              CampusIQ
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-sm text-slate-500 mt-2">
            Join CampusIQ to save colleges, write reviews, and predict your admissions.
          </p>
        </div>

        {/* Registration Card */}
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-200">
          {formError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/colleges" })}
              className="w-full bg-white text-slate-900 hover:bg-slate-100 text-sm font-semibold py-3 rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.01-2.98-1.01-6.18 0-9.16l-7.98-6.2C.7 17.13 0 20.47 0 24c0 3.53.7 6.87 2.69 10.71l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.18-5.59c-2.01 1.35-4.59 2.15-8.71 2.15-6.38 0-11.87-3.63-13.33-8.65l-7.98 6.2C6.71 42.94 14.82 48 24 48z"/></g></svg>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/colleges" })}
              className="w-full bg-[#24292f] hover:bg-[#2c3137] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or continue with email</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="text" {...register("name")} placeholder="Alex Mercer" className="w-full glass-input pl-10 pr-4 py-3 text-sm rounded-xl" autoComplete="name" />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="email" {...register("email")} placeholder="alex@example.com" className="w-full glass-input pl-10 pr-4 py-3 text-sm rounded-xl" autoComplete="email" />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full glass-input pl-10 pr-12 py-3 text-sm rounded-xl"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}</p>}

              {/* Password strength indicators */}
              {passwordValue && passwordValue.length > 0 && (
                <div className="flex gap-3 mt-2">
                  <span className={`text-[10px] font-semibold flex items-center gap-1 ${passwordChecks.length ? "text-emerald-400" : "text-slate-500"}`}>
                    <CheckCircle2 className="h-3 w-3" /> 8+ chars
                  </span>
                  <span className={`text-[10px] font-semibold flex items-center gap-1 ${passwordChecks.hasUpper ? "text-emerald-400" : "text-slate-500"}`}>
                    <CheckCircle2 className="h-3 w-3" /> Uppercase
                  </span>
                  <span className={`text-[10px] font-semibold flex items-center gap-1 ${passwordChecks.hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                    <CheckCircle2 className="h-3 w-3" /> Number
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="password" {...register("confirmPassword")} placeholder="••••••••" className="w-full glass-input pl-10 pr-4 py-3 text-sm rounded-xl" autoComplete="new-password" />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm font-semibold py-3.5 rounded-xl hover:opacity-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
