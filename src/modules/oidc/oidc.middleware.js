import ApiError from "../../common/utils/api-error.js";
import { verifyOidcAccessToken } from "../../common/utils/jwt.utils.js";

export const oidcAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized("Bearer token is missing in OIDC request")
        }
        const token = authHeader.split(" ")[1];

        const payload = verifyOidcAccessToken(token);

        req.oidcUser = payload;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(ApiError.unauthorized("OIDC access token has expired"))
        }
        if (error.name === "JsonWebTokenError") {
            return next(ApiError.unauthorized("Invalid OIDC access token"))
        }
        return next(error);
    }
}