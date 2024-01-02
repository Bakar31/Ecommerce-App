import express from "express";
import {
  getAllProducts,
  createProduct,
  searchProduct,
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
router.get("/search", searchProduct);

router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id/image", verifyToken, updateProductImage);

export default router;
