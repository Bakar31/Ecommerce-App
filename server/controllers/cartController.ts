import { Cart, Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export type CartWithProducts = Prisma.CartGetPayload<{
    include: { items: { include: { product: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
    size: number;
    subtotal: number;
};

export async function createCart(req: Request, res: Response) {
    try {
        console.log("Hello from create cart.");
        const newCart = await prisma.cart.create({
            data: {},
        });

        res.cookie("localCartId", newCart.id);
        console.log("localCartId cookie set");

        const cartData = {
            ...newCart,
            items: [],
            size: 0,
            subtotal: 0,
        };

        return res.status(201).json(cartData);
    } catch (error) {
        console.error("Error occurred while creating cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getCart(req: Request, res: Response) {
    try {
        const localCartId = req.cookies["localCartId"];
        // const localCartId = 20;

        const cart = localCartId
            ? await prisma.cart.findUnique({
                where: { id: localCartId },
                include: { items: { include: { product: true } } },
            })
            : null;

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartSize = cart.items.reduce((acc, item) => acc + item.quantity, 0);

        const cartSubtotal = cart.items.reduce(
            (acc, item) => acc + item.quantity * item.product.price.toNumber(),
            0
        );

        const updatedCart: ShoppingCart = {
            ...cart,
            size: cartSize,
            subtotal: cartSubtotal,
        };

        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error occurred while retrieving cart:", error);
        return res
            .status(500)
            .json({ error: "Error occurred while retrieving cart" });
    }
}

export async function incrementCartCount(req: Request, res: Response) {
    const { articleInCart } = req.body;

    if (!articleInCart) {
        return res.status(400).send("Missing articleInCart data");
    }

    try {
        await prisma.cartItem.update({
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
        });
        return res.status(200).send("Cart count incremented successfully");
    } catch (error) {
        return res.status(500).send("Error incrementing cart count");
    }
}

export async function createCartItem(req: Request, res: Response) {
    const { cartData, productId } = req.body;

    if (!cartData) {
        return res.status(400).send("Missing cart data");
    }

    try {
        await prisma.cartItem.create({
            data: {
                cartId: cartData.id,
                productId: parseInt(productId),
                quantity: 1,
            },
        });
        return res.status(200).send("Cart item created successfully");
    } catch (error) {
        console.log(error)
        return res.status(500).send("Error creating cart item");
    }
}
