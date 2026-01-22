import { db } from "./db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function fetchOrCreateUserProfile(supabaseUserId: string, email: string, fullName?: string) {
  try {
    // Try to find existing profile
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, supabaseUserId),
      with: { leases: true },
    });

    // If doesn't exist, create new profile
    if (!profile) {
      const [newProfile] = await db
        .insert(profiles)
        .values({
          supabaseUserId,
          email,
          fullName: fullName || "New User",
        })
        .returning();

      profile = { ...newProfile, leases: [] };
    }

    return profile;
  } catch (error) {
    console.error("Error fetching/creating profile:", error);
    throw error;
  }
}

export function createFallbackProfile(supabaseUserId: string, email: string, fullName?: string) {
  return {
    id: supabaseUserId,
    supabaseUserId,
    email,
    fullName: fullName || "User",
    companyName: null,
    onboarded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    leases: [],
  };
}

export async function updateUserProfile(
  supabaseUserId: string,
  updates: {
    fullName?: string;
    companyName?: string;
    onboarded?: boolean;
  }
) {
  try {
    await db
      .update(profiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(profiles.supabaseUserId, supabaseUserId));

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function getUserProfile(supabaseUserId: string) {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, supabaseUserId),
      with: { leases: true },
    });

    return profile || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function isUserOnboarded(supabaseUserId: string): Promise<boolean> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, supabaseUserId),
    });

    return profile?.onboarded ?? false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
