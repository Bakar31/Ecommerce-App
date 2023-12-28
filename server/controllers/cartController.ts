import { Cart, Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export type CartWithProducts = Prisma.CartGetPayload<{
    include: { items: { include: { product: true } } }
}>

export type ShoppingCart = CartWithProducts & {
    size: number,
    subtotal: number,
}

export async function createCart(req: Request, res: Response) {
    const newCart = await prisma.cart.create({
        data: {},
    });

    res.cookie("localCartId", newCart.id);
    
    return {
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0,
    };
}

export async function getCart(req: Request, res: Response): Promise<ShoppingCart | null> {
    const localCartId = req.cookies["localCartId"];
    const cart = localCartId
        ? await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { items: { include: { product: true } } },
        })
        : null;

    if (!cart) {
        return null;
    }

    return {
        ...cart,
        size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.items.reduce(
            (acc, item) => acc + item.quantity + item.product.price.toNumber(),
            0
        ),
    };
}
