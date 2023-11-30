"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image: File | null;
}

const AddProducts = () => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    image: null,
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
      }));
    }
  };

  const handleAddProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonDisabled || !formData.image) {
      return;
    }

    setButtonDisabled(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stockQuantity", formData.stockQuantity.toString());
      formDataToSend.append("image", formData.image);

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("New Product added");
        setFormData({
          name: "",
          description: "",
          price: 0,
          stockQuantity: 0,
          image: null,
        });
        router.push(`/products/`)
      } else {
        console.error("Error adding product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Add New Product</h1>

      <form onSubmit={handleAddProductSubmit}>
        <div className="mb-3">
          <input
            required
            name="name"
            type="text"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered input-primary w-full max-w-xl"
          />
        </div>
        <div className="mb-3">
          <textarea
            required
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-secondary w-full max-w-xl"
          ></textarea>
        </div>

        <div className="mb-3">
          <input
            required
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered input-success  w-full max-w-xl"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="stockQuantity"
            type="number"
            placeholder="Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            className="input input-bordered input-accent w-full max-w-xl"
          />
        </div>

        <div className="mb-3">
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
            onChange={handleChangeInput}
          />
        </div>

        <div className="mb-3">
          <button
            className="btn btn-info w-full max-w-xl"
            type="submit"
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
