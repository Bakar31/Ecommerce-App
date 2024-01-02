import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";

interface SearchPageProps {
    searchParams: { query: string };
}

export default function SearchPage({ searchParams: { query } }: SearchPageProps) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/products/search?query=${query}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const productsData = await response.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [query]);

    if (products.length === 0) {
        return <div className="text-center">No products found</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
                <ProductCard products={product} key={product.product_id} />
            ))}
        </div>
    );
}