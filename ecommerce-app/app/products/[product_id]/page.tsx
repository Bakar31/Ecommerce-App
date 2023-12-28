"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToCartButton from "./addToCartButton";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stockquantity: number;
  image_path: string;
}

interface ProductPageProps {
  params: {
    product_id: number;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({
  params: { product_id },
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/checkAuthRole', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          console.error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, []);

  const handleDelete = async () => {
    if (buttonDisabled) {
      return;
    }
    setButtonDisabled(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${product_id}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );

      if (response.ok) {
        router.push(`/products/`);
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {product && (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              loader={() => `http://localhost:8000${product.image_path}`}
              src={`http://localhost:8000${product.image_path}`}
              alt={product.name}
              width={300}
              height={400}
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">{product.name}</h1>
              <p className="py-6">{product.description}</p>

              <p className="text-gray-700 font-semibold">
                Price: ${product.price}
              </p>
              <p className="text-gray-700 font-semibold">
                Stock Quantity: {product.stockquantity}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        {userRole === 'ADMIN' ? (
          <>
            <button
              onClick={handleDelete}
              className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-400 ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "Deleting..." : "Delete"}
            </button>

            <Link
              href={{
                pathname: "/edit-product",
                query: {
                  product_id: product_id,
                },
              }}
              className="bg-blue-500 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-400"
            >
              Edit
            </Link>
          </>
        ) : userRole === 'USER' || userRole === null ? (
          // <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-400">
          //   Buy Now
          // </button>
          <AddToCartButton productId={product_id} />
        ) : null}
      </div>
    </div>
  );
};

export default ProductPage;
