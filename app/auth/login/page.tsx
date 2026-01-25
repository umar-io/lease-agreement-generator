"use client";
import { useState } from "react";
import { login } from "@/app/auth/action";
import { useActionState } from "react";
import { Logo } from "@/app/_components/logo";
import Icon from "@/app/_components/icon";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="bg-[#fcfcfd] dark:bg-[#0f1115] font-sans min-h-screen flex flex-col transition-colors duration-300">
      
      {/* Top Navigation */}
      <header className="w-full bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              New to LeaseGen?
            </span>
            <Link href="/auth/register">
              <button className="rounded-full h-10 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 relative">
        {/* Subtle Background Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none" />

        <div className="w-full max-w-[440px] bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col transition-all">

          {/* Header */}
          <div className="p-10 pb-6 text-center sm:text-left">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
              Access your dashboard to manage your agreements and smart templates.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5 px-10 pb-10" action={formAction}>

            {/* Error Message with Animation */}
            {state?.error && (
              <div className="animate-in fade-in slide-in-from-top-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                {state.error}
              </div>
            )}

            {/* Email Field */}
            <div className="group flex flex-col gap-2">
              <label htmlFor="email" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                disabled={isPending}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 h-12 px-4 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50 placeholder:text-slate-400"
              />
            </div>

            {/* Password Field */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link href="/auth/forgot-password" tabIndex={-1} className="text-primary hover:text-primary-hover text-[13px] font-medium transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 h-12 pl-4 pr-12 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative flex items-center justify-center rounded-xl h-12 bg-primary hover:bg-primary-hover text-white font-bold shadow-md shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isPending ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
              ) : (
                "Log In"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              <span className="mx-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">Or continue with</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 rounded-xl h-12 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Icon name="google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Google</span>
            </button>
          </form>

          {/* Footer */}
          <div className="bg-slate-50/50 dark:bg-slate-900/50 px-8 py-5 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              New here?{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:text-primary-hover transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}