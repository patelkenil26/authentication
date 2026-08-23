CREATE TYPE "public"."role" AS ENUM('customer', 'seller', 'admin', 'support');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"role" "role" DEFAULT 'customer' NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verification_token" text,
	"refresh_token" text,
	"reset_password_token" text,
	"reset_password_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"application_url" varchar(255),
	"redirect_uri" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_client_id_unique" UNIQUE("client_id")
);
