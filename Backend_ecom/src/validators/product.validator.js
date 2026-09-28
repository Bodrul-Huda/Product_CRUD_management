import { body, param } from "express-validator";

export const createProductValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

export const updateProductValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().trim(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

export const productIdValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];
