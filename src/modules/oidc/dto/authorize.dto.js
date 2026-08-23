import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class AuthorizeDto extends BaseDto {
  static schema = Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    response_type: Joi.string().valid("code", "token", "id_token").required(),
    scope: Joi.string().required(),
    state: Joi.string().required(),

    code_challenge: Joi.string().optional(),
    code_challenge_method: Joi.string().valid("S256", "plain").optional(),
  });
}

export default AuthorizeDto;
