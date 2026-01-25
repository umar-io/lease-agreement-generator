"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signup } from "../action";
import { useActionState } from "react";
import { Logo } from "@/app/_components/logo";
import Icon from "@/app/_components/icon";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <div className="font-sans bg-white dark:bg-[#0f1115] text-slate-900 dark:text-white antialiased min-h-screen">
      <div className="flex min-h-screen">
        
        {/* Left Section: Form */}
        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:w-[540px] xl:w-[600px] relative z-10 bg-white dark:bg-[#0f1115]">
          <div className="mx-auto w-full max-w-[400px]">
            
            <header className="mb-12">
              <Logo />
            </header>

            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Get started for free
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                Join thousands of property managers generating professional agreements in minutes.
              </p>
            </div>

            <form className="space-y-5" action={formAction}>
              {state?.error && (
                <div className="animate-in fade-in slide-in-from-top-2 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                  <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                  {state.error}
                </div>
              )}

              <div className="group">
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="name@company.com"
                  required
                  disabled={isPending}
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 pr-11 text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                    placeholder="Create a strong password"
                    required
                    minLength={8}
                    disabled={isPending}
                    onChange={() => setPasswordMatch(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`block w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all disabled:opacity-50 ${
                      passwordMatch
                        ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary"
                        : "border-red-500 bg-red-50/30 ring-1 ring-red-500"
                    }`}
                    placeholder="Repeat your password"
                    required
                    disabled={isPending}
                    onChange={(e) => {
                      const password = (document.getElementById("password") as HTMLInputElement)?.value;
                      setPasswordMatch(e.target.value === password);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    <Icon name={showConfirmPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-red-500 text-[12px] mt-1.5 ml-1 animate-in fade-in">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-all cursor-pointer"
                    required
                    disabled={isPending}
                  />
                </div>
                <label htmlFor="terms" className="text-[13px] text-slate-500 dark:text-slate-400 leading-tight">
                  I agree to the <Link href="#" className="font-bold text-slate-900 dark:text-white hover:text-primary underline-offset-4 decoration-slate-300 underline">Terms</Link> and <Link href="#" className="font-bold text-slate-900 dark:text-white hover:text-primary underline-offset-4 decoration-slate-300 underline">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending || !passwordMatch}
                className="w-full flex justify-center items-center rounded-xl bg-primary h-12 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </form>

            <div className="mt-10">
              <div className="relative flex items-center justify-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="mx-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">Or continue with</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button type="button" disabled={isPending} className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <Icon name="google" className="w-5 h-5" /> Google
                </button>
                <button type="button" disabled={isPending} className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <Icon name="microsoft" className="w-5 h-5" /> Microsoft
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section: Visual */}
        <div className="relative hidden flex-1 lg:block bg-slate-900 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
            alt="Modern office"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-slate-950/90" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-20">
            <div className="max-w-xl">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20">
                <Icon name="quote" className="w-8 h-8 text-primary" />
              </div>
              <blockquote className="text-3xl font-medium text-white leading-tight mb-8">
                "This generator has transformed how we manage our properties. Legally compliant and incredibly easy to use."
              </blockquote>
              <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-xl shadow-primary/20">
                    <div className="absolute inset-0 bg-primary/20" />
                    {/* Optional: Add Sarah's real image here */}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Sarah Chen</p>
                  <p className="text-white/60 text-sm">Property Manager at Urban Living</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}