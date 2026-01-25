// app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import  Icon  from "@/app/_components/icon";
import { createClient } from "@/app/utils/supabase/server";
import { fetchOrCreateUserProfile, createFallbackProfile } from "../lib/profile-service";

function StatCard({ 
  title, 
  value, 
  change, 
  icon
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
          <Icon name={icon} className="w-5 h-5 text-white dark:text-black" />
        </div>
        <span className="text-green-600 text-sm font-medium">{change}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-black dark:text-white mb-1">{value}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  isPrimary = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  isPrimary?: boolean;
}) {
  return (
    <Link href={href} className="block group">
      <div className={`p-8 rounded-lg border transition-all duration-200 hover-lift ${
        isPrimary 
          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
          : "bg-white dark:bg-black border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
      }`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
          isPrimary 
            ? "bg-white dark:bg-black" 
            : "bg-black dark:bg-white"
        }`}>
          <Icon name={icon} className={`w-6 h-6 ${
            isPrimary ? "text-black dark:text-white" : "text-white dark:text-black"
          }`} />
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${
          isPrimary ? "text-white dark:text-black" : "text-black dark:text-white"
        }`}>
          {title}
        </h3>
        <p className={`leading-relaxed mb-6 ${
          isPrimary ? "text-gray-300 dark:text-gray-700" : "text-gray-600 dark:text-gray-400"
        }`}>
          {description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${
            isPrimary ? "text-white dark:text-black" : "text-black dark:text-white"
          }`}>
            Get Started
          </span>
          <Icon 
            name="arrow-right" 
            className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
              isPrimary ? "text-white dark:text-black" : "text-black dark:text-white"
            }`} 
          />
        </div>
      </div>
    </Link>
  );
}

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

  if (!profile.onboarded) {
    return redirect("/onboarding");
  }

  const recentLeases = profile.leases?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-200 dark:border-green-800 rounded-full bg-green-50 dark:bg-green-950">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                  System Active
                </span>
              </div>
              
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white leading-tight mb-6">
                  Welcome back, {profile?.fullName?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your digital workspace for creating legally binding lease agreements. 
                  Ready to generate your next document?
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generate" className="btn btn-primary inline-flex items-center gap-2">
                  <Icon name="plus-circle" className="w-5 h-5" />
                  Create New Lease
                </Link>
                <button className="btn btn-secondary inline-flex items-center gap-2">
                  <Icon name="folder-open" className="w-5 h-5" />
                  Open Draft
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000')`
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium mb-1">Professional Workspace</p>
                  <p className="text-lg font-bold">Generate. Review. Execute.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Active Leases"
              value="24"
              change="+12%"
              icon="file-check"
            />
            <StatCard
              title="This Month"
              value="8"
              change="+4"
              icon="trending-up"
            />
            <StatCard
              title="Revenue"
              value="$12.4k"
              change="+18%"
              icon="dollar-sign"
            />
            <StatCard
              title="Saved Time"
              value="46h"
              change="+22h"
              icon="clock"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Generate Lease"
              description="Create a new legally binding rental agreement with our intelligent form system."
              href="/generate"
              icon="plus-circle"
              isPrimary={true}
            />
            <ActionCard
              title="Browse Templates"
              description="Explore our library of attorney-reviewed templates for all property types."
              href="/templates"
              icon="layers"
            />
            <ActionCard
              title="Document Manager"
              description="Organize, review, and manage all your lease documents in one place."
              href="/documents"
              icon="folder-open"
            />
          </div>
        </section>

        {/* Recent Agreements */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white">Recent Agreements</h2>
            <Link 
              href="/documents" 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium transition-colors duration-200"
            >
              View All
              <Icon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {recentLeases.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                      Tenant
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                      Property
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeases.map((lease, index) => (
                    <tr
                      key={lease.id}
                      className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                            <Icon name="user" className="w-4 h-4 text-white dark:text-black" />
                          </div>
                          <div>
                            <p className="font-medium text-black dark:text-white">{lease.tenantName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tenant</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Icon name="map-pin" className="w-4 h-4" />
                          {lease.address}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(lease.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          lease.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : lease.status === "Finalized"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {lease.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                          <Icon name="more-horizontal" className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Icon name="folder-plus" className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                  Ready to create your first lease?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Get started with our intelligent lease generator. Create professional, 
                  legally binding agreements in minutes.
                </p>
                <Link href="/generate" className="btn btn-primary inline-flex items-center gap-2">
                  Create First Lease
                  <Icon name="arrow-right" className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
