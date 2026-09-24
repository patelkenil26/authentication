import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const clientsTable = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: varchar("client_id", { length: 255 }).notNull().unique(),
  clientSecret: varchar("client_secret", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  applicationUrl: varchar("application_url", { length: 255 }),
  redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const consentsTable = pgTable("consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  clientId: varchar("client_id", { length: 255 }).notNull(),
  scopes: varchar("scopes", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
