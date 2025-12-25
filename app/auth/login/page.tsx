"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="w-full bg-white dark:bg-card-dark border-b border-[#f0f2f4] dark:border-slate-700 px-4 sm:px-10 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-4 text-[#111318] dark:text-white"
          >
            <div className="size-8 text-primary">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              LeaseGen
            </h2>
          </Link>
          <div className="hidden sm:flex gap-3">
            <span className="text-sm font-medium text-[#616f89] dark:text-slate-400 self-center mr-2">
              New to LeaseGen?
            </span>
            <button className="rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-[480px] bg-white dark:bg-card-dark rounded-xl shadow-xl border border-[#f0f2f4] dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="p-8 pb-4">
            <h1 className="text-[#111318] dark:text-white text-3xl font-black tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#616f89] dark:text-slate-400 text-base mt-2">
              Log in to access your lease agreements and templates.
            </p>
          </div>

          <form
            className="flex flex-col gap-5 px-8 pb-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium dark:text-slate-200"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-medium dark:text-slate-200"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 pl-4 pr-12 focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  {/* Next.js doesn't load Material Symbols by default, you can use Lucide-React or SVGs */}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="w-full rounded-lg h-12 bg-primary hover:bg-primary-hover text-white font-bold shadow-sm transition-all active:scale-[0.98]">
              Log In
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#f0f2f4] dark:border-slate-700"></div>
              <span className="mx-4 text-gray-400 text-xs uppercase font-semibold">
                Or continue with
              </span>
              <div className="flex-grow border-t border-[#f0f2f4] dark:border-slate-700"></div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-lg h-12 border border-[#dbdfe6] dark:border-slate-600 dark:bg-slate-800 dark:text-white hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>
          </form>

          <div className="bg-[#f6f6f8] dark:bg-slate-900 px-8 py-4 text-center border-t border-[#f0f2f4] dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="#" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
