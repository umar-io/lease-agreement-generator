import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Matches your utility: async and 0 arguments
    const supabase = await createClient();

    // Use a type cast or interface to fix the 'any' error
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    // 1. Basic validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 2. Session Check
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    // 3. Reauthentication
    const { error: reauthError } = await supabase.auth.reauthenticate({
      password: currentPassword,
    });

    if (reauthError) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // 4. Update Password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';