"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111318] dark:text-white antialiased">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-[#151c2b] border-r border-[#f0f2f4] dark:border-gray-800">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="size-10 text-primary transition-transform group-hover:scale-110">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Lease Generator
              </h2>
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
                Start generating professional lease agreements in minutes.
              </p>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  className="block text-sm font-medium dark:text-gray-200"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-2 block px-4 w-full rounded-lg border-0 py-3 text-[#111318] dark:text-white shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-700 placeholder:text-[#616f89] focus:ring-2 focus:ring-primary dark:bg-[#1a2332] sm:text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium dark:text-gray-200"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="block w-full rounded-lg border-0 py-3 px-4 pr-10 ring-1 ring-[#dbdfe6] dark:ring-gray-700 dark:bg-[#1a2332] sm:text-sm"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#616f89] hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm font-medium dark:text-gray-200"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="block w-full rounded-lg border-0 py-3 px-4 pr-10 ring-1 ring-[#dbdfe6] dark:ring-gray-700 dark:bg-[#1a2332] sm:text-sm"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#616f89] hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-3 block text-sm text-[#616f89] dark:text-gray-400"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="font-semibold text-primary hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="font-semibold text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Sign up
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-[#616f89] dark:bg-[#151c2b] relative z-10">
                  Or continue with
                </span>
                <div className="absolute top-1/2 w-full border-t border-[#dbdfe6] dark:border-gray-700"></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm font-semibold ring-1 ring-[#dbdfe6] dark:ring-gray-700 hover:bg-gray-50 transition-colors">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="h-5 w-5"
                    alt="Google"
                  />
                  Google
                </button>
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm font-semibold ring-1 ring-[#dbdfe6] dark:ring-gray-700 hover:bg-gray-50 transition-colors">
                  <img
                    src="https://www.svgrepo.com/show/448239/microsoft.svg"
                    className="h-5 w-5"
                    alt="Microsoft"
                  />
                  Microsoft
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-[#616f89] dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section: Visual */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
            alt="Modern office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-20 text-white">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">
              format_quote
            </span>
            <p className="text-2xl font-medium leading-relaxed max-w-lg italic">
              "This lease generator has completely transformed how we manage our
              rental properties. It's fast, legally compliant, and incredibly
              easy to use."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/20 border border-white/20" />
              <div>
                <div className="font-bold">Sarah Chen</div>
                <div className="text-white/70 text-sm">
                  Property Manager at Urban Living
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
