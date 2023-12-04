import client from "../config/db";
import { type Request, type Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const UPLOADS_FOLDER = ".././server/public/products/";

export const getProductById = async (req: Request, res: Response) => {
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

export const updateProduct = async (req: Request, res: Response) => {
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
    const fullPath = path.join(__dirname, "../public/", imgPath);
    console.log(fullPath);
    try {
      if (imgPath && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("Image file deleted successfully");
      } else {
        console.log("Image file not found");
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

// Update image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "image" &&
      (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
    }
  },
}).single("image");

export const updateProductImage = async (req: Request, res: Response) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(400).json({
        error: "File upload error",
        message: err.message,
      });
    }

    try {
      const imgPath = `/products/${req.file?.filename}`;
      console.log(` ${imgPath}`);
      const { name, description, price, stockQuantity, product_id } = req.body;
      console.log(req.body);

      if (!name || !description || !price || !stockQuantity || !imgPath) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const query = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, stockquantity = $4, image_path = $5 
      WHERE product_id = $6 
      RETURNING *
    `;

      const values = [
        name,
        description,
        price,
        stockQuantity,
        imgPath,
        product_id,
      ];
      console.log(values);
      const result = await client.query(query, values);

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
