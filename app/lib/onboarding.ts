import { createClient } from "../utils/supabase/server";
import { db } from "./db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Check if the current user has completed onboarding
 * @returns {Promise<boolean>} True if user is onboarded, false otherwise
 * @throws {Error} If user is not authenticated
 */
export async function isUserOnboarded(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, user.id),
    });

    return profile?.onboarded ?? false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

/**
 * Get the current user's profile
 * @returns {Promise<any>} User profile object or null
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, user.id),
      with: { leases: true },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
