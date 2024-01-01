import express from "express";

import {
    createCart,
    getCart, 
    incrementCartCount, 
    createCartItem, 
    deleteCartItem,
    incrementCartCountFromCart,
    mergeAnonymousCartIntoUserCart
} from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.get("/get", getCart);
cartRouter.post("/create", createCart);
cartRouter.delete("/deleteItem", deleteCartItem);
cartRouter.post("/incrementCount", incrementCartCount);
cartRouter.post("/incrementCountFromCart", incrementCartCountFromCart);
cartRouter.post("/createCartItem", createCartItem);
cartRouter.post("/mergeAnonymousCartIntoUserCart", mergeAnonymousCartIntoUserCart);

export default cartRouter;