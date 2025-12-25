"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  Home,
  Store,
  Calendar,
  Key,
  Bell,
  Eye,
  Mountain,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "res-std",
    title: "Standard Residential Lease",
    category: "Residential",
    icon: Home,
    popular: true,
    desc: "Comprehensive agreement for standard 12-month rentals.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400",
  },
  {
    id: "com-off",
    title: "Commercial Office Lease",
    category: "Commercial",
    icon: Store,
    popular: false,
    desc: "Designed for office space rentals. Covers operating expenses.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400",
  },
  {
    id: "m2m-ren",
    title: "Month-to-Month Rental",
    category: "Short-term",
    icon: Calendar,
    popular: false,
    desc: "Flexible agreement with 30-day notice periods.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400",
  },
  {
    id: "res-sub",
    title: "Residential Sublease",
    category: "Residential",
    icon: Key,
    popular: false,
    desc: "Agreement between a tenant and sub-tenant.",
    image:
      "https://images.unsplash.com/photo-1536376074432-bf121770b48a?q=80&w=400",
  },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      {/* Search Bar with Lucide Icon */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-slate-900 shadow-sm"
          placeholder="Search templates..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => {
          // Dynamically render the icon component assigned in the data
          const IconComponent = template.icon;

          return (
            <div
              key={template.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                {template.popular && (
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg dark:text-white">
                {template.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6">{template.desc}</p>
              <button className="w-full py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2">
                Use Template <Plus className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
