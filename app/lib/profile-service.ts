// app/lib/profile-service.ts
import { db } from "./db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/app/utils/supabase/server";

export async function fetchOrCreateUserProfile(
  supabaseUserId: string,
  email: string,
  fullName?: string
) {
  try {
    // Try to find existing profile in Neon
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, supabaseUserId),
      with: { leases: true },
    });

    // If doesn't exist, create new profile in Neon
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

export function createFallbackProfile(
  supabaseUserId: string,
  email: string,
  fullName?: string
) {
  return {
    id: crypto.randomUUID(),
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

// NEW: Complete onboarding with sync to both databases
export async function completeOnboarding(
  supabaseUserId: string,
  data: {
    fullName: string;
    companyName: string;
  }
) {
  try {
    const supabase = await createClient();

    // 1. Update Neon database
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        fullName: data.fullName,
        companyName: data.companyName,
        onboarded: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.supabaseUserId, supabaseUserId))
      .returning();

    // 2. Update Supabase Auth user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
        company_name: data.companyName,
        onboarded: true,
      },
    });

    if (error) {
      console.error("Error updating Supabase user metadata:", error);
      // Don't throw - Neon is source of truth
    }

    return updatedProfile;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error;
  }
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
    const supabase = await createClient();

    // 1. Update Neon database (source of truth)
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(profiles.supabaseUserId, supabaseUserId))
      .returning();

    // 2. Sync to Supabase Auth metadata
    if (updates.fullName || updates.companyName || updates.onboarded !== undefined) {
      await supabase.auth.updateUser({
        data: {
          ...(updates.fullName && { full_name: updates.fullName }),
          ...(updates.companyName && { company_name: updates.companyName }),
          ...(updates.onboarded !== undefined && { onboarded: updates.onboarded }),
        },
      });
    }

    return updatedProfile;
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
    return null;
  }
}

export async function isUserOnboarded(supabaseUserId: string): Promise<boolean> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.supabaseUserId, supabaseUserId),
      columns: {
        onboarded: true,
      },
    });

    return profile?.onboarded ?? false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}