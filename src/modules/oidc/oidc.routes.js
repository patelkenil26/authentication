import { Router } from "express";
import {
    authorizeController,
    authorizeSubmitController,
    getJwks,
    getOpenIdConfiguration,
    registerClientController,
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

const router = Router();

router.get("/.well-known/openid-configuration", getOpenIdConfiguration);
router.get("/.well-known/jwks.json", getJwks);
router.post(
    "/admin/register-client",
    validate(RegisterClientDto),
    registerClientController,
);
router.get("/o/authorize", validateQuery(AuthorizeDto), authorizeController);
router.post("/o/authorize", validate(AuthorizeSubmitDto), authorizeSubmitController)
router.post("/o/token", validate(TokenDto), tokenController)
router.get("/o/userinfo", oidcAuthenticate, userInfoController)
router.post("/o/revoke", validate(RevokeDto), revokeController);


export default router;
