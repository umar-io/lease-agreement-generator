ALTER TABLE "leases" RENAME COLUMN "property_address" TO "address";--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_email_unique";--> statement-breakpoint
ALTER TABLE "leases" DROP CONSTRAINT "leases_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "profile_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "supabase_user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_supabase_user_id_unique" UNIQUE("supabase_user_id");