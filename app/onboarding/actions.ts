"use server";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { fetchOrCreateUserProfile, updateUserProfile } from "../lib/profile-service";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;

  try {
    // Ensure profile exists
    await fetchOrCreateUserProfile(user.id, user.email!);

    // Update with onboarding data
    await updateUserProfile(user.id, {
      fullName,
      companyName,
      onboarded: true,
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error;
  }
}
