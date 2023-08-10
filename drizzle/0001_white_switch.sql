ALTER TABLE "preferences" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "preferences" ADD COLUMN "anonymous_permissions" "anonymous_permissions" DEFAULT 'allowed';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferencesId" text;