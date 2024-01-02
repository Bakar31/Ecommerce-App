"use client"

import { useEffect, useState } from 'react';
import CartEntry from './cartEntry';

interface Order {
    id: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
    totalAmount: number;
    orderItems: {
        id: number;
        productId: number;
        quantity: number;
    }[];
}

export default function AllOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        async function fetchAllOrders() {
            try {
                const response = await fetch('http://localhost:8000/api/cart/allorders', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch all orders');
                }

                const allOrders = await response.json();
                setOrders(allOrders);
            } catch (error) {
                console.error('Error fetching all orders:', error);
            }
        }

        fetchAllOrders();
    }, []);

    console.log(orders)

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold">All Orders</h1>
            {orders.map((order) => (
                <div key={order.id} className="border rounded p-4 mb-4">
                    <p className="text-lg font-semibold">Order ID: {order.id}</p>
                    <div className="mb-2">
                        <p>User ID: {order.user.id}</p>
                        <p>User Email: {order.user.email}</p>
                        <p>User Name: {order.user.name}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-2">Total Amount: {order.totalAmount}</p>
                        {order.orderItems.map((cartItem) => (
                            <CartEntry key={cartItem.id} cartItem={cartItem} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
