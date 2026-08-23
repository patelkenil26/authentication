import ApiError from "../utils/api-error.js";

const validate = (Dtoclass) => {
  return (req, res, next) => {
    const { errors, value } = Dtoclass.validate(req.body);
    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export const validateQuery = (Dtoclass) => {
  return (req, res, next) => {
    const { errors, value } = Dtoclass.validate(req.query);
    if (errors) {
      return next(ApiError.badRequest(errors.json(";")));
    }
    req.query = value;
    next();
  };
};

export default validate;
