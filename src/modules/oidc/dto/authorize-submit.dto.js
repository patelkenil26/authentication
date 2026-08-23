import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class AuthorizeSubmitDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),

        // hidden params
        client_id: Joi.string().required(),
        redirect_uri: Joi.string().required(),
        scope: Joi.string().required(),
        state: Joi.string().required(),
        code_challenge: Joi.string().optional(),
        code_challenge_method: Joi.string().valid("S256", "plain").optional(),
    })
}

export default AuthorizeSubmitDto;
