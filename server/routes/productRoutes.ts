import express from 'express';
import { getAllProducts, createProduct } from '../controllers/allProductsController';
import { getProductById, updateProduct, deleteProduct, updateProductImage } from '../controllers/productsControllerbyId';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/image', updateProductImage);

export default router;