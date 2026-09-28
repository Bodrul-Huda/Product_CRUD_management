import { Router } from "express";
import {
  login,
  logout,
  me,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, me);

export default router;
