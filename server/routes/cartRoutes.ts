import express from "express";

import {
    createCart,
    getCart, 
    deleteCart,
    incrementCartCount, 
    createCartItem, 
    deleteCartItem,
    incrementCartCountFromCart,
    mergeAnonymousCartIntoUserCart,
    checkout,
    getOrders,
    allOrders
} from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.get("/get", getCart);
cartRouter.get("/getorders/:id", getOrders);
cartRouter.get("/allorders", allOrders);
cartRouter.post("/create", createCart);
cartRouter.delete("/deleteCart", deleteCart);
cartRouter.delete("/deleteItem", deleteCartItem);
cartRouter.post("/incrementCount", incrementCartCount);
cartRouter.post("/incrementCountFromCart", incrementCartCountFromCart);
cartRouter.post("/createCartItem", createCartItem);
cartRouter.post("/mergeAnonymousCartIntoUserCart", mergeAnonymousCartIntoUserCart);
cartRouter.post("/checkout", checkout);

export default cartRouter;