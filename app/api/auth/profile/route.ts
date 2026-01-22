import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { fetchOrCreateUserProfile } from "@/app/lib/profile-service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", profile: null },
        { status: 401 }
      );
    }

    try {
      const profile = await fetchOrCreateUserProfile(
        user.id,
        user.email!,
        user.user_metadata?.full_name
      );

      return NextResponse.json(profile);
    } catch (dbError) {
      console.error("Database error in profile API:", dbError);
      // Return a minimal profile on database error
      return NextResponse.json(
        {
          id: user.id,
          supabaseUserId: user.id,
          email: user.email || "",
          fullName: user.user_metadata?.full_name || "User",
          companyName: null,
          onboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          leases: [],
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", profile: null },
      { status: 500 }
    );
  }
}
