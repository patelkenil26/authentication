import ApiError from "../utils/api-error.js";

export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(ApiError.unauthorized("Authentication required to verify role"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("Access denied: You do not have the required permissions for this action")
      );
    }

    next();
  };
};
