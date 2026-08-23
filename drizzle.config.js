import { defineConfig } from "drizzle-kit"
import "dotenv/config"

schema : "./src/modules/**/*.schema.js"

export default defineConfig({
    schema: ["./src/modules/auth/auth.schema.js", "./src/modules/oidc/oidc.schema.js"],
    out: "./drizzle",
    dialect: "postgresql",

    dbCredentials: {
        url: process.env.DATABASE_URL,
    },

    verbose: true,
    strict: true,

})