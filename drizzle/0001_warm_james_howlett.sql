CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"scopes" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
