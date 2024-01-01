"use client"

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import CartEntry from './cartEntry';
import { setProductQuantity } from './action';

interface CartItem {
    id: number;
}

interface CartData {
    items: CartItem[];
    size: number
    subtotal: number;
}

export default function CartPage() {
    const [cart, setCart] = useState<CartData | null>(null);
    const router = useRouter();

    const handleCheckout = () => {
        router.push(`/products/`);
    };

    useEffect(() => {
        async function fetchCartData() {
            try {
                const response = await fetch("http://localhost:8000/api/cart/get", {
                    method: "GET",
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cart data");
                }

                const cartData: CartData = await response.json();
                setCart(cartData);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        }

        fetchCartData();
    }, []);

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
            {cart?.items.map((cartItem) => (
                <CartEntry
                    cartItem={cartItem}
                    key={cartItem.id}
                    setProductQuantity={setProductQuantity}
                />
            ))}
            {!cart?.items.length && <p>Your cart is empty.</p>}
            <div className="flex flex-col items-end sm:items-center">
                <p className="mb-3 font-bold">
                    Total: {cart ? parseFloat(cart.subtotal.toFixed(2)) || 0 : 'Loading...'}
                </p>
                <button className="btn-primary btn sm:w-[200px]"
                onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
}
