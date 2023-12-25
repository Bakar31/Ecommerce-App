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
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePriceFilter = () => {
    const filtered = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    // console.log(filtered)
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Filter Products</h2>
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
        <ProductList products={paginatedProducts} />
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="mx-2 px-3 py-1 border rounded bg-white text-blue-500"
        >
          Previous
        </button>
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
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
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
          className="mx-2 px-3 py-1 border rounded bg-white text-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
