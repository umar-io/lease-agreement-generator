import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. PROFILES TABLE (The Bridge)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(), // Internal Neon ID
  supabaseUserId: text("supabase_user_id").notNull().unique(), // ID from Supabase Auth
  email: text("email").notNull(),
  fullName: text("full_name"),
  companyName: text("company_name"),
  onboarded: boolean("onboarded").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. LEASES TABLE
export const leases = pgTable("leases", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  tenantName: text("tenant_name").notNull(),
  address: text("address").notNull(),
  status: text("status").default("Draft"), // e.g., Draft, Finalized, Review
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. RELATIONS (Required for db.query... syntax)
export const profilesRelations = relations(profiles, ({ many }) => ({
  leases: many(leases),
}));

export const leasesRelations = relations(leases, ({ one }) => ({
  profile: one(profiles, {
    fields: [leases.profileId],
    references: [profiles.id],
  }),
}));