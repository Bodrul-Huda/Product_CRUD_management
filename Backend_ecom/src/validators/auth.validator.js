import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];
