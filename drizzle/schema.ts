// drizzle/schema.ts
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  supabaseUserId: uuid("supabase_user_id").notNull().unique(), // Maps to snake_case in DB
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
  tenantName: text("tenant_name"),
  address: text("address"),
  status: text("status").default("draft").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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