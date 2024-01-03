"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

type CartItemWithProduct = {
    product: {
        product_id: number;
        name: string;
        description: string | null;
        price: number;
        stockquantity: number;
        image_path: string | null;
    };
} & {
    id: number;
    productId: number;
    quantity: number;
    cartId: number;
}

interface CartEntryProps {
    cartItem: CartItemWithProduct;
}

export default function CartEntry({
    cartItem: { product, quantity },
}: CartEntryProps) {
    const [isPending, startTransition] = useTransition();
    const imagePath = product.image_path || '';

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3">
                <Image
                loader={() => `http://localhost:8000${imagePath}`}
                    src={`http://localhost:8000${imagePath}`}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg"
                />
                <div>
                    <Link href={"/products/" + product.product_id} className="font-bold">
                        {product.name}
                    </Link>
                    <div>Price: {product.price}</div>
                    <div className="my-1 flex items-center gap-2">
                        Quantity: {product.stockquantity}
                    </div>
                    <div className="flex items-center gap-3">
                        Total: {product.price * quantity}
                        {isPending && (
                            <span className="loading loading-spinner loading-sm" />
                        )}
                    </div>
                </div>
            </div>
            <div className="divider" />
        </div>
    );
}