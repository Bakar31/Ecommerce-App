export async function setProductQuantity(productId: string, quantity: number) {
    try {
        let cartData;

        const response = await fetch("http://localhost:8000/api/cart/get", {
            method: "GET",
            credentials: 'include',
        });

        if (!response.ok) {
            try {
                const createResponse = await fetch("http://localhost:8000/api/cart/create", {
                    method: "POST",
                    credentials: 'include',
                });

                if (!createResponse.ok) {
                    throw new Error("Failed to create a new cart.");
                }

                cartData = await createResponse.json();
            } catch (createError) {
                console.error("Error creating cart:", createError);
                return;
            }
        } else {
            cartData = await response.json();
        }

        const articleInCart = cartData.items.find((item: { productId: number; }) => item.productId === parseInt(productId, 10));

        if (quantity === 0) {
            if (articleInCart) {
                const response = await fetch("http://localhost:8000/api/cart/deleteItem", {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ articleInCart })
                });
                
            }
        } else {
            if (articleInCart) {
                const incrementResponse = await fetch("http://localhost:8000/api/cart/incrementCountFromCart", {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ articleInCart, quantity })
                });
            }

            // revalidatePath("/cart");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
