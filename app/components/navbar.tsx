"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  PlusCircle,
  User,
  ChevronDown,
  LogOut,
  CreditCard,
  Sparkles,
  Search
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: Layers },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Don't show navbar on the Landing Page
  if (pathname === "/" || pathname === "/auth/register" || pathname === "/auth/login") return null;

  // Handle outside click for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Logo & Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-primary size-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <PlusCircle size={22} strokeWidth={2.5} />
              </div>
              <span className="font-black text-xl tracking-tighter dark:text-white uppercase">
                LeaseGen
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Search, Notifications, Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold dark:text-white leading-none">Alex Rivera</p>
                  <p className="text-[11px] text-primary font-bold mt-1 uppercase tracking-wider">Pro Plan</p>
                </div>
                <div className="relative">
                  <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <User size={20} className="text-slate-500" />
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Content */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 origin-top-right bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                  </div>
                  <DropdownItem href="/settings" icon={<User size={16} />} label="My Profile" />
                  <DropdownItem href="/settings" icon={<CreditCard size={16} />} label="Subscription" />
                  <DropdownItem href="/settings" icon={<Settings size={16} />} label="Settings" />
                  
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <LogOut size={16} />
                    Sign Out
                  </button>

                  <div className="mx-2 mt-2 p-3 bg-linear-to-br from-primary to-blue-700 rounded-xl text-white">
                    <p className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles size={12} /> Membership
                    </p>
                    <p className="text-[11px] opacity-90 mt-1 leading-tight">Your Pro plan expires in 22 days. Renew now.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE: Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU: Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-300">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <item.icon size={24} />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold text-red-500">
                <LogOut size={24} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}