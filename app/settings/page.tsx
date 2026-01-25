// app/settings/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/app/_components/icon";
import showToast from "@/app/ui/toast";
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

import { useAuth } from "@/app/hooks/auth-context";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [formField, setformField] = useState({
    email: "",
    fullName: "",
    companyName: "",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: ""
  });

  const [isUpdating, setIsUpdating] = useState(false)

  const isDirty = formField.email !== user?.email || formField.fullName !== user?.fullName || formField.companyName !== user?.companyName

  useEffect(() => {
    if (user) {
      setformField({
        email: user?.email || '',
        fullName: user?.fullName || '',
        companyName: user?.companyName || '',
      })
    }
  }, [user])

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Please log in to view settings</div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformField((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async () => {
    // Strict Validation
    if (!formField.fullName.trim() || !formField.companyName.trim()) {
      showToast("Name and Company cannot be empty.", "error");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formField.fullName,
          companyName: formField.companyName,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to update profile");

      showToast("Profile updated successfully!", "success");

      // Optional: If you want the 'Save Changes' button to disappear 
      // immediately without a full page refresh, you might need to 
      // update your Auth Context or trigger a router.refresh()
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Validation
    const { current, newPassword } = password;

    if (!current) {
      showToast("Please enter your current password.", "error")
      return;
    }

    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }

    if (current === newPassword) {
      showToast("New password cannot be the same as the current password.", "info");
      return;
    }

    setIsUpdating(true)

    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: current,
          newPassword: newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to update password");

      // 2. Success Logic
      showToast("Password updated!", "success");
      setPassword({ current: "", newPassword: "" });
    } catch (err: any) {
      showToast(err.message, "error");
    }
    finally {
      setIsUpdating(false)
    }
  };

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
                      name='email'
                      value={formField.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formField.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formField.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>


                {
                  isDirty && (
                    <button
                      disabled={isUpdating}
                      className={`${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'} w-fit px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm`} onClick={handleProfileUpdate}>
                      Save Changes
                    </button>
                  )
                }
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
                    name="current"
                    value={password.current}
                    type="password"
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Password</label>
                  <input
                    name="newPassword"
                    value={password.newPassword}
                    type="password"
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  disabled={isUpdating}
                  className={`${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'} w-fit px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold text-sm`} onClick={handlePasswordSubmit}>
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
                  <span className="text-slate-500">
                    {user.leases?.length || 0} / Unlimited
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((user.leases?.length || 0) * 10, 100)}%` }}
                  />
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active
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