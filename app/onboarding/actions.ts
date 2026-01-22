"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { fetchOrCreateUserProfile, updateUserProfile } from "@/app/lib/profile-service";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;

  try {
    // Ensure profile exists (gracefully handles DB errors)
    await fetchOrCreateUserProfile(user.id, user.email!);

    // Update with onboarding data (gracefully handles DB errors)
    await updateUserProfile(user.id, {
      fullName,
      companyName,
      onboarded: true,
    });

    // Always redirect to dashboard even if DB is down
    // The app will work with temporary profile and sync when DB is available
    redirect("/dashboard");
  } catch (error) {
    console.error("Onboarding error:", error);
    // Re-throw only if it's an auth error or similar critical issue
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    // For database errors, still redirect to allow the app to function
    redirect("/dashboard");
  }
}

 