import { handleProviderLogin } from "./providers.service.js";
import { getGoogleAuthUrl } from "./list/google.provider.js";
import ApiError from "../../../common/utils/api-error.js";
import ApiResponse from "../../../common/utils/api-response.js";

export const providerRedirect = (req, res, next) => {
    const { provider } = req.params;

    let url;
    if (provider === "google") {
        url = getGoogleAuthUrl();
    } else {
        return next(ApiError.badRequest("Invalid Provider"));
    }

    res.redirect(url);
};

export const providerCallback = async (req, res, next) => {
    try {
        const { provider } = req.params;
        const { code } = req.query;

        if (!code) throw ApiError.badRequest("Authorization code is missing");

        const { user, accessToken, refreshToken } = await handleProviderLogin(provider, code);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        ApiResponse.ok(res, `${provider} Login Successful`, { user, accessToken });
    } catch (error) {
        next(error);
    }
};
