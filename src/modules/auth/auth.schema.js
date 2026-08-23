import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ["customer", "seller", "admin", "support"])

export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"), // for OIDC & SSO
    role: roleEnum("role").default("customer").notNull(),

    isVerified: boolean("is_verified").default(false),
    verificationToken: text("verification_token"),

    refreshToken: text("refresh_token"),
    resetPasswordToken: text("reset_password_token"),
    resetPasswordExpires: timestamp("reset_password_expires", { mode: "date" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})