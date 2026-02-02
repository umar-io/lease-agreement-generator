// drizzle/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@/drizzle/schema";
import { leases, profiles } from "@/drizzle/schema";
import { eq, or, desc, and } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

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
  templateType?: string;
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

/**
 * Insert a new lease record
 * Returns the ID of the created lease
 */
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
    templateType: lease.templateType || 'standard',
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

/**
 * Get a lease by ID
 */
export async function getLeaseById(id: string) {
  const result = await db.select().from(leases).where(eq(leases.id, id));
  return result[0];
}

/**
 * Update lease with PDF URL and AI content
 * Also updates status to 'generated'
 */
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

/**
 * Update lease status
 */
export async function updateLeaseStatus(id: string, status: string) {
  await db.update(leases)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(leases.id, id));
}

/**
 * Get all leases for a profile
 */
export async function getLeasesByProfileId(profileId: string) {
  const result = await db
    .select()
    .from(leases)
    .where(eq(leases.profileId, profileId))
    .orderBy(desc(leases.createdAt));
  return result;
}

/**
 * Get leases by status for a profile
 */
export async function getLeasesByStatus(profileId: string, status: string) {
  const result = await db
    .select()
    .from(leases)
    .where(
      and(
        eq(leases.profileId, profileId),
        eq(leases.status, status)
      )
    )
    .orderBy(desc(leases.createdAt));
  return result;
}

/**
 * Get profile by Supabase user ID
 */
export async function getProfileBySupabaseId(supabaseUserId: string) {
  const result = await db.select().from(profiles)
    .where(eq(profiles.supabaseUserId, supabaseUserId));
  return result[0];
}

/**
 * Delete a lease (soft delete by updating status)
 */
export async function deleteLease(id: string) {
  await db.update(leases)
    .set({
      status: 'deleted',
      updatedAt: new Date(),
    })
    .where(eq(leases.id, id));
}

/**
 * Get recent leases (last 10)
 */
export async function getRecentLeases(profileId: string, limit: number = 10) {
  const result = await db
    .select()
    .from(leases)
    .where(eq(leases.profileId, profileId))
    .orderBy(desc(leases.createdAt))
    .limit(limit);
  return result;
}

export { leases, profiles };