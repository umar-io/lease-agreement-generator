import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@/drizzle/schema";
import { leases, profiles } from "@/drizzle/schema"; // Import these for your functions
import { eq, or, desc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Fix: Initialize ONCE with the schema object
export const db = drizzle(client, { schema });

export interface LeaseRecord {
  profileId: string;
  landlordName: string;
  landlordEmail: string;
  tenantName: string;
  tenantEmail: string;
  streetAddress: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  petsAllowed: boolean;
  smokingPolicy: string;
  additionalNotes?: string;
  aiGeneratedContent?: string;
  pdfUrl?: string;
  cloudinaryPublicId?: string;
  status?: string;
}

// --- Helper Functions ---

export async function insertLease(lease: LeaseRecord): Promise<string> {
  const result = await db.insert(leases).values({
    profileId: lease.profileId,
    landlordName: lease.landlordName,
    landlordEmail: lease.landlordEmail,
    tenantName: lease.tenantName,
    tenantEmail: lease.tenantEmail,
    streetAddress: lease.streetAddress,
    unit: lease.unit || null,
    city: lease.city,
    state: lease.state,
    zip: lease.zip,
    startDate: new Date(lease.startDate),
    endDate: new Date(lease.endDate),
    monthlyRent: lease.monthlyRent.toString(),
    securityDeposit: lease.securityDeposit.toString(),
    petsAllowed: lease.petsAllowed,
    smokingPolicy: lease.smokingPolicy,
    additionalNotes: lease.additionalNotes || null,
    aiGeneratedContent: lease.aiGeneratedContent || null,
    pdfUrl: lease.pdfUrl || null,
    cloudinaryPublicId: lease.cloudinaryPublicId || null,
    status: lease.status || 'draft',
  }).returning({ id: leases.id });

  return result[0].id;
}

export async function getLeaseById(id: string) {
  const result = await db.select().from(leases).where(eq(leases.id, id));
  return result[0];
}

export async function updateLeasePdfUrl(
  id: string,
  pdfUrl: string,
  publicId: string,
  aiContent: string
) {
  await db.update(leases)
    .set({
      pdfUrl,
      cloudinaryPublicId: publicId,
      aiGeneratedContent: aiContent,
      status: 'generated',
      updatedAt: new Date(),
    })
    .where(eq(leases.id, id));
}

export async function getProfileBySupabaseId(supabaseUserId: string) {
  const result = await db.select().from(profiles)
    .where(eq(profiles.supabaseUserId, supabaseUserId));
  return result[0];
}

export { leases, profiles };