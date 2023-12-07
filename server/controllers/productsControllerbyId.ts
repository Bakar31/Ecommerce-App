import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const UPLOADS_FOLDER = ".././server/public/products/";

export const getProductById = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.products.findUnique({
      where: {
        product_id: productId,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} not found` });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  let { name, description, price, stockquantity } = req.body;

  price = parseInt(price);
  stockquantity = parseInt(stockquantity);

  try {
    const updatedProduct = await prisma.products.update({
      where: {
        product_id: productId,
      },
      data: {
        name,
        description,
        price,
        stockquantity,
      },
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.products.findUnique({
      where: {
        product_id: productId,
      },
      select: {
        image_path: true,
      },
    });

    if (!product || !product.image_path) {
      return res
        .status(404)
        .json({ error: "Product not found or image path is missing" });
    }

    const deletedProduct = await prisma.products.delete({
      where: {
        product_id: productId,
      },
    });

    const fullPath = path.join(__dirname, `../public/${product.image_path}`);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("Image file deleted successfully");
      } else {
        console.log("Image file not found");
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
      const { name, description, price, stockQuantity, product_id } = req.body;

      if (!name || !description || !price || !stockQuantity || !imgPath) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const updatedProduct = await prisma.products.update({
        where: {
          product_id: parseInt(product_id),
        },
        data: {
          name,
          description,
          price,
          stockquantity: parseInt(stockQuantity),
          image_path: imgPath,
        },
      });

      return res.status(201).json(updatedProduct);
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
