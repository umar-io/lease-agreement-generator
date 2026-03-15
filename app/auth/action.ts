// app/auth/action.ts
"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (e) {
    if (e instanceof APIError) {
      switch (e.status) {
        case "UNAUTHORIZED":
          return { error: "Invalid email or password." };
        case "TOO_MANY_REQUESTS":
          return { error: "Too many attempts. Please wait a few minutes." };
        default:
          return { error: e.message ?? "Something went wrong." };
      }
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

// app/auth/action.ts
export async function signup(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  const email           = formData.get("email") as string;
  const password        = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const terms           = formData.get("terms");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (!terms) {
    return { error: "You must accept the Terms of Service." };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: email.split("@")[0],
      },
      headers: await headers(),
    });
  } catch (e) {
    // ── Log the real error to your terminal ──
    console.error("=== SIGNUP ERROR ===");
    console.error("Type:", typeof e);
    console.error("Error:", e);
    if (e instanceof Error) {
      console.error("Message:", e.message);
      console.error("Stack:", e.stack);
    }
    // ─────────────────────────────────────────

    if (e instanceof APIError) {
      return { error: `APIError [${e.status}]: ${e.message}` };
    }

    return { error: `Unexpected error: ${e instanceof Error ? e.message : String(e)}` };
  }

  redirect("/dashboard");
}
export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/auth/login");
}