"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";

const AddProducts = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imgPath: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  function handleChangeInput(event) {
    console.log(`Selected file - ${event.target.files[0].name}`);
    setFormData({
      ...formData,
      imgPath: `/products/${event.target.files[0].name}`,
    });
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) {
      return;
    }
    
    setButtonDisabled(true);
    console.log(formData);
    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("New Product added");
        setFormData({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
          imgPath: "",
        });

        setTimeout(() => {
          window.location.href = "/products";
        }, 2000);
      } else {
        console.error("Error adding product:", response.statusText);
      }
    } catch {
      console.error("Error adding product");
    }finally {
      setButtonDisabled(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Add New Product</h1>

      <form action="/upload" method="post" encType="multipart/form-data" onSubmit={handleAddProductSubmit}>
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
            {buttonDisabled ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
