"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import  Icon  from "@/app/_components/icon";
import { useAuth } from "@/app/hooks/auth-context";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { name: "Templates", href: "/templates", icon: "layers" },
  { name: "Documents", href: "/documents", icon: "file-text" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Check if we should hide navbar before calling other hooks
  if (
    pathname === "/" ||
    pathname === "/auth/register" ||
    pathname === "/auth/login" ||
    pathname === "/auth/verify-mail"
  )
    return null;

  return <NavbarContent />;
}

function NavbarContent() {
  const pathname = usePathname(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-primary size-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Icon name="plus-circle" className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tighter dark:text-white uppercase">
                Leezign
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
                    <Icon
                      name={item.icon}
                      className={`w-[18px] h-[18px] ${
                        isActive ? "stroke-[2.5]" : "stroke-2"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <Icon name="search" className="w-5 h-5" />
            </button>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
                disabled={isLoading}
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold dark:text-white leading-none">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-[11px] text-primary font-bold mt-1 uppercase tracking-wider">
                    Pro
                  </p>
                </div>

                <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Icon name="user" className="w-5 h-5 text-slate-500" />
                </div>

                <Icon
                  name="chevron-down"
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft py-2 z-50">
                  <DropdownItem
                    href="/settings"
                    icon="user"
                    label="My Profile"
                  />
                  <DropdownItem
                    href="/settings"
                    icon="credit-card"
                    label="Subscription"
                  />
                  <DropdownItem
                    href="/settings"
                    icon="settings"
                    label="Settings"
                  />

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Icon name="log-out" className="w-4 h-4" />
                    Sign Out
                  </button>

                  <div className="mx-2 mt-2 p-3 bg-linear-to-br from-primary to-blue-700 rounded-xl text-white">
                    <p className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider">
                      <Icon name="sparkles" className="w-3 h-3" />
                      Membership
                    </p>
                    <p className="text-[11px] opacity-90 mt-1">
                      Your Pro plan expires in 22 days.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              <Icon
                name={isMobileMenuOpen ? "x" : "menu"}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-slate-950 z-40">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold"
              >
                <Icon name={item.icon} className="w-6 h-6" />
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-5 py-4 text-lg font-bold text-red-500"
              >
                <Icon name="log-out" className="w-6 h-6" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function DropdownItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
    >
      <Icon name={icon} className="w-4 h-4 text-slate-400" />
      {label}
    </Link>
  );
}