import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { ROLES } from "../../../common/constants/roles.constant.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .message("Password must contain 8 chars minimum")
      .required(),
    role: Joi.string().valid(ROLES.CUSTOMER, ROLES.SELLER).default(ROLES.CUSTOMER),
  });
}

export default RegisterDto;
