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
      body:    { email, password },
      headers: await headers(),
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    if (e instanceof APIError) {
      switch (e.status) {
        case "UNAUTHORIZED":
          return { error: "Invalid email or password." };
        case "TOO_MANY_REQUESTS":
          return { error: "Too many attempts. Please try again later." };
        default:
          return { error: e.message ?? "Something went wrong." };
      }
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function signup(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  const email           = formData.get("email") as string;
  const password        = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const firstName       = formData.get("firstName") as string ?? "";
  const lastName        = formData.get("lastName") as string ?? "";
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
    return { error: "You must accept the Terms of Service to continue." };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`.trim() || email.split("@")[0],
      },
      headers: await headers(),
    });
  } catch (e) {
    console.error("SIGNUP ERROR:", e);
    if (e instanceof APIError) {
      switch (e.status) {
        case "UNPROCESSABLE_ENTITY":
          return { error: "An account with this email already exists." };
        case "TOO_MANY_REQUESTS":
          return { error: "Too many attempts. Please try again later." };
        default:
          return { error: e.message ?? "Something went wrong." };
      }
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/auth/login");
}