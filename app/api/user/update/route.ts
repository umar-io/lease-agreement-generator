import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db"; // Ensure this points to your Drizzle initialization
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { fullName, companyName } = await request.json();

        // 1. Authenticate with Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 2. Update Neon DB using Drizzle
        // This targets the 'profiles' table and 'company_name' column defined in your schema
        await db.update(profiles)
            .set({
                fullName: fullName,
                companyName: companyName,
                updatedAt: new Date(), // Good practice to update the timestamp
            })
            .where(eq(profiles.supabaseUserId, user.id)); 

        return NextResponse.json({ message: "Success" });
    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}