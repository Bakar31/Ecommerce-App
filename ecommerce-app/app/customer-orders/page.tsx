"use client"

import { useEffect, useState } from 'react';
import CartEntry from './cartEntry';

interface Order {
    state: string;
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 2;

    const handleStateChange = async (orderId: number, newState: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cart/updateOrderStatus`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, newState }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order state');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, state: newState } : order
                )
            );

        } catch (error) {
            console.error('Error updating order state:', error);
        }
    };


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

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        const totalPages = Math.ceil(orders.length / ordersPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold">All Orders</h1>
            {currentOrders.map((order) => (
                <div key={order.id} className="border rounded p-4 mb-4">
                    <p className="text-lg font-semibold">Order ID: {order.id}</p>
                    <div className="mb-2">
                        <p>User ID: {order.user.id}</p>
                        <p>User Email: {order.user.email}</p>
                        {/* <p>User Name: {order.user.name}</p> */}
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-2">State:
                            <select
                                value={order.state || ''}
                                onChange={(e) => handleStateChange(order.id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-2">Total Amount: {order.totalAmount}</p>
                        {order.orderItems.map((cartItem) => (
                            <CartEntry key={cartItem.id} cartItem={cartItem} />
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex justify-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="mx-2 px-3 py-1 border rounded bg-white text-blue-500"
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`mx-2 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                    className="mx-2 px-3 py-1 border rounded bg-white text-blue-500"
                >
                    Next
                </button>
            </div>

        </div>
    );
}
