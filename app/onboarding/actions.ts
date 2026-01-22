"use server";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { db } from "../lib/db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;

  // Check if profile exists
  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.supabaseUserId, user.id),
  });

  if (existingProfile) {
    // Update existing profile
    await db
      .update(profiles)
      .set({
        fullName,
        companyName,
        onboarded: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.supabaseUserId, user.id));
  } else {
    // Create new profile
    await db.insert(profiles).values({
      supabaseUserId: user.id,
      email: user.email!,
      fullName,
      companyName,
      onboarded: true,
    });
  }

  redirect("/dashboard");
}
