// drizzle/schema.ts
import { pgTable, text, timestamp, boolean, uuid, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  supabaseUserId: uuid("supabase_user_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  companyName: text("company_name"),
  onboarded: boolean("onboarded").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leases = pgTable("leases", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  
  // Landlord info (from profile)
  landlordName: text("landlord_name").notNull(),
  landlordEmail: text("landlord_email").notNull(),
  
  // Tenant info
  tenantName: text("tenant_name").notNull(),
  tenantEmail: text("tenant_email").notNull(),
  
  // Property details
  streetAddress: text("street_address").notNull(),
  unit: text("unit"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  
  // Lease terms
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  
  // Policies
  petsAllowed: boolean("pets_allowed").default(false).notNull(),
  smokingPolicy: text("smoking_policy").notNull(),
  additionalNotes: text("additional_notes"),
  
  // Generated content
  aiGeneratedContent: text("ai_generated_content"), // The AI-generated lease text
  
  // File storage
  pdfUrl: text("pdf_url"), // Cloudinary URL
  cloudinaryPublicId: text("cloudinary_public_id"),
  
  // Status
  status: text("status").default("draft").notNull(), // draft, generated, signed, active, expired
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  profileIdIdx: index("profile_id_idx").on(table.profileId),
  landlordEmailIdx: index("landlord_email_idx").on(table.landlordEmail),
  tenantEmailIdx: index("tenant_email_idx").on(table.tenantEmail),
  statusIdx: index("status_idx").on(table.status),
}));

// Define relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  leases: many(leases),
}));

export const leasesRelations = relations(leases, ({ one }) => ({
  profile: one(profiles, {
    fields: [leases.profileId],
    references: [profiles.id],
  }),
}));

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Lease = typeof leases.$inferSelect;
export type NewLease = typeof leases.$inferInsert;