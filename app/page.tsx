"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you would typically integrate with Mailchimp or Resend
    }
  };

  return (
    <div className="py-[200px] relative isolate overflow-hidden bg-white dark:bg-slate-950 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6">
      {/* Background Decorative Glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="max-w-3xl text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-bounce">
          <Sparkles size={14} /> Launching Q2 2026
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white">
          Generate bulletproof leases in{" "}
          <span className="text-primary">minutes.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          The smarter way for landlords and property managers to create,
          customize, and sign legal rental agreements without the lawyer fees.
        </p>

        {/* Email Waitlist */}
        <div className="max-w-md mx-auto">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                Join Waitlist <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800">
              <CheckCircle2 size={24} /> You're on the list! We'll be in touch.
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Join 500+ landlords already waiting.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
          <Feature
            icon={<ShieldCheck className="text-primary" />}
            title="Legally Valid"
            desc="Attorney-reviewed templates for all 50 states."
          />
          <Feature
            icon={<Zap className="text-primary" />}
            title="Rapid Gen"
            desc="Answer a few questions, get a PDF in seconds."
          />
          <Feature
            icon={<Clock className="text-primary" />}
            title="E-Signatures"
            desc="Built-in signing for you and your tenants."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
      <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}
