"use client";

import React, { useState, useEffect } from "react";
import ProductList from "../components/productCard";

interface Product {
  name: string;
  description: string;
  price: number;
  stockquantity: number;
  product_id: number;
  image_path: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePriceFilter = () => {
    const filtered = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    console.log(filtered)
    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold">Filter products</h2>
    <div className="mb-4 flex flex-wrap items-center">
        <label className="block mb-2" htmlFor="minPrice">
          Min Price:
        </label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(parseInt(e.target.value))}
          className="border border-gray-300 px-2 py-1 mr-2"
        />
        <label className="block mb-2" htmlFor="maxPrice">
          Max Price:
        </label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="border border-gray-300 px-2 py-1 mr-2"
        />
        <button
          onClick={handlePriceFilter}
          className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>
    <div>
      <ProductList products={filteredProducts} />
    </div>
    </div>
  );
};

export default Products;
