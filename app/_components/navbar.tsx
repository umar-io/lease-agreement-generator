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

  if (
    pathname === "/" ||
    pathname === "/auth/register" ||
    pathname === "/auth/login"
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
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <Icon name="sparkles" className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="font-bold text-xl text-black dark:text-white">
              Leezign
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200">
              <Icon name="search" className="w-5 h-5" />
            </button>

            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200">
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                disabled={isLoading}
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-black dark:text-white">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pro
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Icon name="user" className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <Icon
                  name="chevron-down"
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <DropdownItem href="/settings" icon="user" label="My Profile" />
                    <DropdownItem href="/settings" icon="credit-card" label="Subscription" />
                    <DropdownItem href="/settings" icon="settings" label="Settings" />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 p-2">
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors duration-200"
                    >
                      <Icon name="log-out" className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <Icon name={isMobileMenuOpen ? "x" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors duration-200"
              >
                <Icon name={item.icon} className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-4">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors duration-200"
              >
                <Icon name="log-out" className="w-5 h-5" />
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
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors duration-200"
    >
      <Icon name={icon} className="w-4 h-4" />
      {label}
    </Link>
  );
}
