// app/documents/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import {
  fetchOrCreateUserProfile,
  createFallbackProfile,
} from "@/app/lib/profile-service";
import DocumentsClient from "./document-client";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let profile;

  try {
    profile = await fetchOrCreateUserProfile(
      user.id,
      user.email!,
      user.user_metadata?.full_name
    );
  } catch {
    profile = createFallbackProfile(
      user.id,
      user.email!,
      user.user_metadata?.full_name
    );
  }

  if (!profile.onboarded) redirect("/onboarding");

  const leases = (profile.leases ?? []).map((lease) => ({
    ...lease,
    updatedAt: lease.updatedAt.toISOString(),
    createdAt: lease.createdAt.toISOString(),
  }));

  return <DocumentsClient leases={leases} />;
}
