"use client";
import React, { useState } from "react";
import {
  User,
  Lock,
  CreditCard,
  Bell,
  Mail,
  Shield,
  ChevronRight,
  ExternalLink,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your account, security, and billing preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex flex-col gap-1">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<User size={18} />}
            label="Profile"
          />
          <TabButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            icon={<Lock size={18} />}
            label="Security"
          />
          <TabButton
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
            icon={<CreditCard size={18} />}
            label="Subscription"
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* PROFILE SECTION */}
          {activeTab === "profile" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <SectionHeading
                title="Profile Information"
                subtitle="Update your account email and personal details."
              />
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      defaultValue="alex@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button className="w-fit px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm">
                  Save Email
                </button>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === "security" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <SectionHeading
                title="Security"
                subtitle="Change your password to keep your account secure."
              />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button className="w-fit px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold text-sm">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* BILLING SECTION */}
          {activeTab === "billing" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <SectionHeading
                title="Subscription Plan"
                subtitle="Manage your billing and subscription tier."
              />

              {/* Plan Card */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">
                      Pro Plan
                    </h3>
                    <p className="text-sm text-slate-500">
                      Unlimited lease agreements • $19/mo
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                  Manage in Stripe <ExternalLink size={14} />
                </button>
              </div>

              {/* Usage Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Documents Generated</span>
                  <span className="text-slate-500">12 / Unlimited</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div className="h-full w-[40%] bg-primary rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active
          ? "bg-primary text-white shadow-lg shadow-primary/20"
          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
      <h2 className="text-xl font-bold dark:text-white">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
