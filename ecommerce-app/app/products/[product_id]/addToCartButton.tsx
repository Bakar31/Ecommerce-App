"use client"

import { useState, useTransition } from "react";

interface AddToCartButtonProps {
    productId: number;
    incrementProductQuantity: (productId: number) => Promise<void>

}

export default function AddToCartButton({ productId, incrementProductQuantity }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <button
                className="btn btn-primary"
                disabled={isPending}
                onClick={() => {
                    setSuccess(false);
                    startTransition(async () => {
                        await incrementProductQuantity(productId);
                        setSuccess(true);
                    });
                }}
            >
                Add to Cart
            </button>
            {isPending && <span className="loading loading-spinner loading-md" />}
            {success && !isPending && (
                <span className="text-success">Added to Cart.</span>
            )}
        </div>
    );
}