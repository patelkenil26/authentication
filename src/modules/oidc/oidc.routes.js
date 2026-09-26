import { Router } from "express";
import {
    authorizeController,
    authorizeSubmitController,
    getJwks,
    getOpenIdConfiguration,
    registerClientController,
    getDeveloperClientsController,
    revokeController,
    tokenController,
    userInfoController,
} from "./oidc.controller.js";
import RegisterClientDto from "./dto/register-client.dto.js";
import validate, {
    validateQuery,
} from "../../common/middleware/validate.middleware.js";
import AuthorizeDto from "./dto/authorize.dto.js";
import AuthorizeSubmitDto from "./dto/authorize-submit.dto.js";
import TokenDto from "./dto/token.dto.js";
import { oidcAuthenticate } from "./oidc.middleware.js";
import RevokeDto from "./dto/revoke.dto.js";

import { authenticate } from "../auth/auth.middleware.js";
import { authorizeRole } from "../../common/middleware/rbac.middleware.js";
import { ROLES } from "../../common/constants/roles.constant.js";

import { authLimiter } from "../../common/middleware/rate-limiter.middleware.js";

const router = Router();

router.get("/.well-known/openid-configuration", getOpenIdConfiguration);
router.get("/.well-known/jwks.json", getJwks);

router.post(
    "/admin/register-client",
    authenticate,
    authorizeRole([ROLES.ADMIN]),
    validate(RegisterClientDto),
    registerClientController,
);

router.post(
    "/developer/clients",
    authenticate,
    validate(RegisterClientDto),
    registerClientController,
);

router.get(
    "/developer/clients",
    authenticate,
    getDeveloperClientsController,
);
router.get("/o/authorize", validateQuery(AuthorizeDto), authorizeController);
router.post("/o/authorize", validate(AuthorizeSubmitDto), authorizeSubmitController)
router.post("/o/token", authLimiter, validate(TokenDto), tokenController)
router.get("/o/userinfo", oidcAuthenticate, userInfoController)
router.post("/o/revoke", validate(RevokeDto), revokeController);

export default router;
