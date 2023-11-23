"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stockquantity: number;
}

interface ProductPageProps {
  params: {
    product_id: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({
  params: { product_id },
}) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${product_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setProduct(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProduct();
  }, [product_id]);

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:8000/api/products/${product_id}`,
      { method: "DELETE" }
    );

    if (response.ok){
      console.log('Product deleted');
    } else {
      console.error('Failed to delete product');
    }
  };

  
  return (
    <div className="container mx-auto p-4">
      {product && (
        <div className="p-4">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-700 font-semibold mb-2">
            Price: ${product.price}
          </p>
          <p className="text-gray-700 font-semibold">
            Stock Quantity: {product.stockquantity}
          </p>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-400"
        >
          Delete
        </button>

        <Link
          href={{
            pathname: '/edit-product',
            query: {
              product_id: product_id,
              name: product?.name,
              description: product?.description,
              price: product?.price,
              stockQuantity: product?.stockquantity,
            },
          }}
          className="bg-blue-500 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-400"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
