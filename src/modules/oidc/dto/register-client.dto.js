import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterClientDto extends BaseDto {
  static schema = Joi.object({
    displayName: Joi.string().trim().min(3).max(255).required(),
    applicationUrl: Joi.string().uri().optional(),
    redirectUri: Joi.string().uri().required(),
    logoUri: Joi.string().uri().optional(),
  });
}
export default RegisterClientDto;
