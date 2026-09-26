import { db } from "../../../common/config/db.js";
import { userTable, oauthAccountsTable } from "../auth.schema.js";
import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "../../../common/utils/jwt.utils.js";
import { getGoogleProfile } from "./list/google.provider.js";
import ApiError from "../../../common/utils/api-error.js";

import { sendWelcomeEmail } from "../../../common/config/email.js";

const getProfileFromProvider = async (provider, code) => {
    switch (provider) {
        case "google": return await getGoogleProfile(code);
        default: throw ApiError.badRequest(`Unsupported provider: ${provider}`);
    }
};

export const handleProviderLogin = async (provider, code) => {
    const profile = await getProfileFromProvider(provider, code);

    const [existingOAuth] = await db.select().from(oauthAccountsTable)
        .where(eq(oauthAccountsTable.providerAccountId, profile.providerId)).limit(1);

    let user;

    if (existingOAuth) {
        [user] = await db.select().from(userTable).where(eq(userTable.id, existingOAuth.userId));
    } else {
        const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, profile.email));

        if (existingUser) {
            user = existingUser;
        } else {
            // New user registration via OAuth
            [user] = await db.insert(userTable).values({
                email: profile.email,
                name: profile.name,
                isVerified: profile.isVerified, // Google accounts verified
            }).returning();

            try {
                await sendWelcomeEmail(user.email, user.name);
            } catch (err) {
                console.error("Failed to send welcome email for OAuth user:", err.message);
            }
        }

        await db.insert(oauthAccountsTable).values({
            userId: user.id,
            provider: provider,
            providerAccountId: profile.providerId,
        });
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await db.update(userTable).set({ refreshToken }).where(eq(userTable.id, user.id));

    return { user, accessToken, refreshToken };
};
