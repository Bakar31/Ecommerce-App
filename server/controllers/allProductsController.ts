import client from "../config/db";
import { type Request, type Response } from "express";
import multer from "multer";
import path from "path";

const UPLOADS_FOLDER = ".././server/public/products/";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const result = await client.query("SELECT * FROM products");
    const data = result.rows;
    return res.json(data);
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
      console.log(imgPath)
      const { name, description, price, stockQuantity } = req.body;

      if (!name || !description || !price || !stockQuantity || !imgPath) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const query =
        "INSERT INTO products (name, description, price, stockquantity, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const values = [name, description, price, stockQuantity, imgPath];
      const result = await client.query(query, values);

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};