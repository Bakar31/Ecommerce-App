import client from "../config/db";
import { type Request, type Response } from 'express'

export const getAllProducts = async (_req:Request, res:Response) => {
  try {
    const result = await client.query("SELECT * FROM products");
    const data = result.rows;
    return res.json(data);
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createProduct = async (req:Request, res:Response) => {
  console.log(req.body);
  const { name, description, price, stockQuantity } = req.body;

  if (!name || !description || !price || !stockQuantity) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  try {
    const query =
      "INSERT INTO products (name, description, price, stockQuantity) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, description, price, stockQuantity];
    const result = await client.query(query, values);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
