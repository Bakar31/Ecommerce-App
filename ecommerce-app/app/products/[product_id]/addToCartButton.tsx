"use client"

interface AddToCartButtonProps {
    productId: number,
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
    return (
        <div className="flex items-center gap-2">
            <button className="btn btn-primary">
                Add to Cart
            </button>
        </div>
    )
}