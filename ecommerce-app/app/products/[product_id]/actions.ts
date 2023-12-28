export async function incrementProductQuantity(productId: number) {
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

        const articleInCart = cartData.items.find((item: { productId: number; }) => item.productId === productId);

    } catch (error) {
        console.error("Error:", error);
    }
}
