import client from "../config/db";
import { type Request, type Response } from 'express'
import fs from 'fs';
import path from 'path';

export const getProductById = async (req:Request, res:Response) => {
  const productId = req.params.id;

  try {
    const result = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [productId]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} not found` });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req:Request, res:Response) => {
  const productId = req.params.id;
  const { name, description, price, stockquantity } = req.body;
  try {
    const checkProduct = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [productId]
    );

    if (checkProduct.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} not found` });
    }

    const result = await client.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stockquantity = $4 WHERE product_id = $5 RETURNING *",
      [name, description, price, stockquantity, productId]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  let imgPath: string;

  try {
    const imgeInfo = await client.query(
      "SELECT image_path FROM products WHERE product_id = $1",
      [productId]
    );
    const product = imgeInfo.rows[0];
    if (!product || !product.image_path) {
      return res
        .status(404)
        .json({ error: "Product not found or image path is missing" });
    }
    imgPath = product.image_path;
  } catch (error) {
    console.error("Error getting the product image:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  try {
    const result = await client.query(
      "DELETE FROM products WHERE product_id = $1",
      [productId]
    );

    // Delete product image
    const fullPath = path.join(__dirname, "../../ecommerce-app/public/", imgPath);
    try {
      if (imgPath && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log('Image file deleted successfully');
      } else {
        console.log('Image file not found');
      }

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: `Product with ID ${productId} not found` });
      }

      return res.json({
        message: `Product with ID ${productId} deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting image file:", error);
      return res.status(500).json({ error: "Error deleting image file" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
