import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { ROLES, ROLE_VALUES } from "../../common/constants/roles.constant.js";

export const roleEnum = pgEnum('role', ROLE_VALUES)

export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"), // for OIDC & SSO
    role: roleEnum("role").default(ROLES.CUSTOMER).notNull(),

    isVerified: boolean("is_verified").default(false),
    verificationToken: text("verification_token"),

    refreshToken: text("refresh_token"),
    resetPasswordToken: text("reset_password_token"),
    resetPasswordExpires: timestamp("reset_password_expires", { mode: "date" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const oauthAccountsTable = pgTable("oauth_accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    provider: varchar("provider", { length: 50 }).notNull(), // e.g., 'google', 'github'
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(), // Google ka unique ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
})