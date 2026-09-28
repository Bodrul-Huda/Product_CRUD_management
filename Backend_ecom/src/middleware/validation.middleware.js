import { validationResult } from "express-validator";

const validateRequest = (request, response, next) => {
  const validationErrors = validationResult(request);

  if (!validationErrors.isEmpty()) {
    return response.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

export default validateRequest;
