"use client";
import { useState } from "react";
import { login } from "../action";
import { useActionState } from "react";
import { Logo } from "@/app/components/logo";
import { Icon } from "@/app/components/icon";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col transition-colors duration-200">

      {/* Top Navigation */}
      <header className="w-full bg-white dark:bg-card-dark border-b border-[#f0f2f4] dark:border-slate-700 px-4 sm:px-10 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="hidden sm:flex gap-3">
            <span className="text-sm font-medium text-[#616f89] dark:text-slate-400 self-center mr-2">
              New to LeaseGen?
            </span>
            <Link href="/auth/register">
              <button className="rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-[480px] bg-white dark:bg-card-dark rounded-xl shadow-xl border border-[#f0f2f4] dark:border-slate-700 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="p-8 pb-4">
            <h1 className="text-[#111318] dark:text-white text-3xl font-black tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#616f89] dark:text-slate-400 text-base mt-2">
              Log in to access your lease agreements and templates.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5 px-8 pb-8" action={formAction}>

            {/* Error */}
            {state?.error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {state.error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium dark:text-slate-200">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                disabled={isPending}
                className="rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium dark:text-slate-200">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={isPending}
                  className="w-full rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 pl-4 pr-12 focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg h-12 bg-primary hover:bg-primary-hover text-white font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Logging in..." : "Log In"}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#f0f2f4] dark:border-slate-700"></div>
              <span className="mx-4 text-gray-400 text-xs uppercase font-semibold">Or continue with</span>
              <div className="flex-grow border-t border-[#f0f2f4] dark:border-slate-700"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 rounded-lg h-12 border border-[#dbdfe6] dark:border-slate-600 dark:bg-slate-800 dark:text-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="google" className="w-5 h-5" />
              Google
            </button>
          </form>

          {/* Footer */}
          <div className="bg-[#f6f6f8] dark:bg-slate-900 px-8 py-4 text-center border-t border-[#f0f2f4] dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
