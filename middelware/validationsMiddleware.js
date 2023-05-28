import { validationResult } from "express-validator";

export default (req, resp, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};
