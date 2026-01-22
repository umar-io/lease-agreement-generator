"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signup } from "../action";
import { useActionState } from "react";
import { Logo } from "@/app/components/logo";
import { Icon } from "@/app/components/icon";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111318] dark:text-white antialiased">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-[#151c2b] border-r border-[#f0f2f4] dark:border-gray-800">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <Logo />
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
                Start generating professional lease agreements in minutes.
              </p>
            </div>

            <form className="mt-8 space-y-6" action={formAction}>
              {state?.error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium dark:text-gray-200"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-2 block px-4 w-full rounded-lg border-0 py-3 text-[#111318] dark:text-white shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-700 placeholder:text-[#616f89] focus:ring-2 focus:ring-primary dark:bg-[#1a2332] sm:text-sm disabled:opacity-50"
                  placeholder="name@company.com"
                  required
                  disabled={isPending}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="block w-full rounded-lg border-0 py-3 px-4 pr-10 ring-1 ring-[#dbdfe6] dark:ring-gray-700 dark:bg-[#1a2332] sm:text-sm disabled:opacity-50"
                    placeholder="Create a password (min 8 characters)"
                    required
                    minLength={8}
                    disabled={isPending}
                    onChange={() => setPasswordMatch(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#616f89] hover:text-primary transition-colors"
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
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
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`block w-full rounded-lg border-0 py-3 px-4 pr-10 ring-1 ${
                      passwordMatch
                        ? "ring-[#dbdfe6] dark:ring-gray-700"
                        : "ring-red-500 dark:ring-red-500"
                    } dark:bg-[#1a2332] sm:text-sm disabled:opacity-50`}
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                    disabled={isPending}
                    onChange={(e) => {
                      const password = (document.getElementById(
                        "password"
                      ) as HTMLInputElement)?.value;
                      setPasswordMatch(e.target.value === password);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#616f89] hover:text-primary transition-colors"
                  >
                    <Icon
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                  required
                  disabled={isPending}
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
                disabled={isPending || !passwordMatch}
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating account..." : "Sign up"}
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
                <button
                  type="button"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm font-semibold ring-1 ring-[#dbdfe6] dark:ring-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="google" className="w-5 h-5" />
                  Google
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm font-semibold ring-1 ring-[#dbdfe6] dark:ring-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="microsoft" className="w-5 h-5" />
                  Microsoft
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-[#616f89] dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
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
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-20 text-white">
            <Icon name="quote" className="text-4xl text-primary mb-4" />
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
