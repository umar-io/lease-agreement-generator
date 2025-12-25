"use server";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { prisma } from "../lib/prisma";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;

  // Create or update the profile in our database
  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      fullName,
      companyName,
      onboarded: true,
    },
    create: {
      id: user.id,
      email: user.email!,
      fullName,
      companyName,
      onboarded: true,
    },
  });

  redirect("/dashboard");
}
