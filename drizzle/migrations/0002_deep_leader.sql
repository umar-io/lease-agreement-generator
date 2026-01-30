ALTER TABLE "leases" RENAME COLUMN "address" TO "landlord_email";--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "tenant_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "landlord_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "tenant_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "street_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "unit" text;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "zip" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "monthly_rent" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "security_deposit" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "pets_allowed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "smoking_policy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "additional_notes" text;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "ai_generated_content" text;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "cloudinary_public_id" text;--> statement-breakpoint
CREATE INDEX "profile_id_idx" ON "leases" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "landlord_email_idx" ON "leases" USING btree ("landlord_email");--> statement-breakpoint
CREATE INDEX "tenant_email_idx" ON "leases" USING btree ("tenant_email");--> statement-breakpoint
CREATE INDEX "status_idx" ON "leases" USING btree ("status");--> statement-breakpoint
ALTER TABLE "leases" DROP COLUMN "content";