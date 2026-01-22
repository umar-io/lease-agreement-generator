// app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import  Icon  from "@/app/_components/icon";
import { createClient } from "@/app/utils/supabase/server";
import { fetchOrCreateUserProfile, createFallbackProfile } from "../lib/profile-service";

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

  // Use real leases from database or show empty state
  const recentLeases = profile.leases?.slice(0, 5) || [];

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
          {recentLeases.length > 0 ? (
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
                {recentLeases.map((lease) => (
                  <tr
                    key={lease.id}
                    className="border-b border-[#dbdfe6] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Icon name="users" className="w-4 h-4" />
                        {lease.tenantName}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 text-[#616f89] dark:text-gray-400 text-sm">
                      {lease.address}
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 text-[#616f89] dark:text-gray-400 text-sm">
                      {new Date(lease.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${lease.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : lease.status === "Finalized"
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
          ) : (
            <div className="p-12 text-center">
              <Icon name="folder-archive" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-[#111318] dark:text-white mb-2">
                No leases yet
              </h3>
              <p className="text-[#616f89] dark:text-gray-400 mb-4">
                Get started by creating your first lease agreement
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-700 text-white font-bold transition-all"
              >
                Create Lease
              </Link>
            </div>
          )}
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