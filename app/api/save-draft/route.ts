// app/api/save-draft/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leaseId } = body;

    // Validate required fields
    if (!leaseId) {
      return NextResponse.json(
        { error: "Missing lease ID" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update lease status to "draft" (it should already be draft, but we confirm)
    const { data: lease, error: updateError } = await supabase
      .from("leases")
      .update({
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leaseId)
      .select()
      .single();

    if (updateError) {
      console.error("Database error:", updateError);
      return NextResponse.json(
        {
          error: "Failed to save draft",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lease,
      message: "Draft saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      {
        error: "Failed to save draft",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

