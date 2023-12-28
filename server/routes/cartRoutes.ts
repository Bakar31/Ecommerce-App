import express from "express";

import { createCart, getCart } from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.get("/get", getCart);
cartRouter.post("/create", createCart);

export default cartRouter;