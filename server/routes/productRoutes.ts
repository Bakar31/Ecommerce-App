import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/allProductsController";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImage,
} from "../controllers/productsControllerbyId";
import { verifyToken } from "../middleware";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", deleteProduct);
router.put("/:id/image", updateProductImage);

export default router;
