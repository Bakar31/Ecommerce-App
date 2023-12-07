import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const UPLOADS_FOLDER = ".././server/public/products/";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany();
    return res.json(products);
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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

export const createProduct = async (req: Request, res: Response) => {
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
      const { name, description, price, stockQuantity } = req.body;

      if (!name || !description || !price || !stockQuantity || !imgPath) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const newProduct = await prisma.products.create({
        data: {
          name,
          description,
          price,
          stockquantity: parseInt(stockQuantity),
          image_path: imgPath,
        },
      });

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
