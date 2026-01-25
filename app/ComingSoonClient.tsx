"use client";
import React, { useState } from "react";
import { Icon } from "./_components/icon";

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center space-y-4 p-8">
      <div className="w-12 h-12 mx-auto bg-black dark:bg-white rounded-full flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6 text-white dark:text-black" />
      </div>
      <h3 className="font-bold text-xl text-black dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-16">
          {/* Launch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Launching Q2 2026
            </span>
          </div>

          {/* Hero Title */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black dark:text-white">
              Generate bulletproof leases in minutes.
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            The smarter way for landlords and property managers to create,
            customize, and sign legal rental agreements without the lawyer fees.
          </p>

          {/* Email Waitlist */}
          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-black dark:focus:border-white transition-colors duration-200 outline-none"
                />
                <button
                  type="submit"
                  className="w-full btn btn-primary"
                >
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div className="p-6 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ You're on the list! We'll be in touch.
                </p>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Join 2,400+ landlords already waiting.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-200 dark:border-gray-800">
            <Feature
              icon="shield-check"
              title="Legally Valid"
              desc="Attorney-reviewed templates for all 50 states, updated continuously for legal compliance."
            />
            <Feature
              icon="zap"
              title="Lightning Fast"
              desc="Answer a few strategic questions, get a comprehensive PDF in under 60 seconds."
            />
            <Feature
              icon="pen-tool"
              title="Digital Signatures"
              desc="Built-in e-signature workflow for landlords and tenants. Complete everything digitally."
            />
          </div>

          {/* CTA Section */}
          <div className="pt-16">
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                Ready to revolutionize your rental process?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Be among the first to experience the future of lease management. 
                Early access members get exclusive pricing and priority support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-primary">
                  Request Early Access
                </button>
                <button className="btn btn-secondary">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
