import express from "express";

import { createCart, getCart, incrementCartCount, createCartItem } from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.get("/get", getCart);
cartRouter.post("/create", createCart);
cartRouter.post("/incrementCount", incrementCartCount);
cartRouter.post("/createCartItem", createCartItem);

export default cartRouter;