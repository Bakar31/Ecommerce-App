"use client"

import { useEffect, useState } from "react";
import CartEntry from "./cartEntry";

interface CartItemWithProduct {
    id: number;
    productId: number;
    quantity: number;
    cartId: number;
    product: {
        product_id: number;
        name: string;
        description: string | null;
        price: number;
        stockquantity: number;
        image_path: string | null;
    };
}

interface Order {
    id: number;
    totalAmount: number;
    orderItems: CartItemWithProduct[];
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    const pathname = window.location.pathname;
    const id = pathname.split('/').pop();

    useEffect(() => {
        async function fetchOrderHistory() {
            try {
                const response = await fetch(`http://localhost:8000/api/cart/getorders/${id}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch order history");
                }

                const orderData: Order[] = await response.json();
                setOrders(orderData);
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        }

        fetchOrderHistory();
    }, [id]);

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Order History</h1>
            {orders.map((order) => (
                <div key={order.id} className="my-6">
                    <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                    <p>Total Amount: {order.totalAmount}</p>
                    {order.orderItems.map((cartItem) => (
                        <CartEntry
                            key={cartItem.id}
                            cartItem={cartItem}
                        />
                    ))}
                </div>
            ))}
            {!orders.length && <p>No orders found.</p>}
        </div>
    );
}
