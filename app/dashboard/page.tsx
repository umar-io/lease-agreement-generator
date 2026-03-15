// ✅ NO "use client" here
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./client";
import './style/dashboard.css'

export default async function DashboardPage() {
  // 1. Get the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("FULL SESSION:", JSON.stringify(session, null, 2));

  if (!session?.user) {
    redirect("/auth/login");
  }

  // 3. Pass the user data to the Client Component
  return <DashboardClient user={session.user} />;
}