import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/app/components/icon";

import { createClient } from "../utils/supabase/server";
import { fetchOrCreateUserProfile, createFallbackProfile } from "../lib/profile-service";

const RECENT_AGREEMENTS = [
  {
    id: 1,
    tenant: "John Doe",
    address: "123 Maple St, Springfield",
    date: "Oct 24, 2023",
    status: "Draft",
    statusColor: "yellow",
  },
  {
    id: 2,
    tenant: "Jane Smith",
    address: "456 Oak Ave, Shelbyville",
    date: "Oct 20, 2023",
    status: "Finalized",
    statusColor: "green",
  },
  {
    id: 3,
    tenant: "Acme Corp",
    address: "789 Pine Ln, Capital City",
    date: "Oct 15, 2023",
    status: "Review",
    statusColor: "blue",
  },
];

export default async function DashboardPage() {


  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  let profile = null;

  try {
    profile = await fetchOrCreateUserProfile(
      user.id,
      user.email!,
      user.user_metadata?.full_name
    );
  } catch (error) {
    console.error("❌ Database error:", error);
    // Fallback to temporary profile
    profile = createFallbackProfile(
      user.id,
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name
    );
  }

  // Check if user has completed onboarding
  if (!profile.onboarded) {
    return redirect("/onboarding");
  }


  


  return (
    <div className="layout-content-container flex flex-col max-w-240 flex-1 mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col gap-6 px-4 py-10 md:flex-row items-center">
        <div className="w-full aspect-video bg-cover rounded-xl shadow-sm md:w-1/2 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000')]" />
        <div className="flex flex-col gap-6 md:w-1/2 md:justify-center">
          <div>
            <h1 className="text-[#111318] dark:text-white text-4xl font-black tracking-tight md:text-5xl">
              Welcome back, {profile?.fullName || 'User'}
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base mt-2">
              Ready to create a new agreement? Draft legally binding leases in
              minutes or continue where you left off.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/generate"
              className="flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <span className="pr-4">
                <Icon name="plus-circle-solid" className="w-5 h-5" />
              </span>
              Start New Lease
            </Link>
            <button className="flex items-center justify-center rounded-lg h-12 px-5 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 text-[#111318] dark:text-white font-bold hover:bg-gray-50 transition-colors">
              <span className="pr-4">
                <Icon name="folder-archive" className="w-5 h-5" />
              </span>
              Open Saved Draft
            </button>
          </div>
        </div>
      </section>

      {/* Recent Agreements Table */}
      <section className="mt-8 px-4">
        <h2 className="text-[#111318] dark:text-white text-2xl font-bold mb-4">
          Recent Agreements
        </h2>
        <div className="overflow-hidden rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-[#dbdfe6] dark:border-gray-700">
                <th className="px-4 py-4 text-sm font-semibold">Tenant Name</th>
                <th className="hidden sm:table-cell px-4 py-4 text-sm font-semibold">
                  Property Address
                </th>
                <th className="hidden md:table-cell px-4 py-4 text-sm font-semibold">
                  Last Edited
                </th>
                <th className="px-4 py-4 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_AGREEMENTS.map((lease) => (
                <tr
                  key={lease.id}
                  className="border-b border-[#dbdfe6] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Icon name="users" className="w-4 h-4" />
                      {lease.tenant}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 text-[#616f89] dark:text-gray-400 text-sm">
                    {lease.address}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 text-[#616f89] dark:text-gray-400 text-sm">
                    {lease.date}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${lease.statusColor === "yellow"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : lease.statusColor === "green"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                    >
                      {lease.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 py-10">
        {[
          {
            title: "Lease Templates",
            desc: "Browse pre-approved templates.",
            iconName: "gavel",
          },
          {
            title: "Legal Guides",
            desc: "Understand state legalities.",
            iconName: "gavel",
          },
          {
            title: "FAQs",
            desc: "Common questions answered.",
            iconName: "help-circle",
          },
        ].map((resource, i) => (
          <div
            key={i}
            className="group p-6 rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-4">
              <Icon name={resource.iconName} className="w-5 h-5" />
            </div>
            <h3 className="font-bold group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-[#616f89] dark:text-gray-400 text-sm mt-1">
              {resource.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
