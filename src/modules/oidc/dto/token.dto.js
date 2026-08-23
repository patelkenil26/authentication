import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class TokenDto extends BaseDto {
    static schema = Joi.object({
        grant_type: Joi.string().valid("authorization_code", "refresh_token").required(),
        client_id: Joi.string().required(),
        code: Joi.string().when("grant_type", { is: "authorization_code", then: Joi.required() }),
        redirect_uri: Joi.string().uri().when("grant_type", { is: "authorization_code", then: Joi.required() }),
        refresh_token: Joi.string().when("grant_type", { is: "refresh_token", then: Joi.required() }),

        client_secret: Joi.string().optional(),
        code_verifier: Joi.string().optional(), // PKCE 
    }).or('client_secret', 'code_verifier');
}

export default TokenDto;