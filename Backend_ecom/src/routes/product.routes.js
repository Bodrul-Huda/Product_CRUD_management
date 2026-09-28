import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  productIdValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import authenticateUser from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validation.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  createProductValidator,
  validateRequest,
  createProduct,
);
router.get("/", getProducts);
router.get("/:id", productIdValidator, validateRequest, getProductById);
router.put(
  "/:id",
  authenticateUser,
  productIdValidator,
  updateProductValidator,
  validateRequest,
  updateProduct,
);
router.delete(
  "/:id",
  authenticateUser,
  productIdValidator,
  validateRequest,
  deleteProduct,
);

export default router;
