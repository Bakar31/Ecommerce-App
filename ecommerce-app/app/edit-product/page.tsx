"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const EditProduct = ({
  searchParams,
}: {
  searchParams: {
    product_id: any;
    name: string;
    description: string;
    price: string;
    stockQuantity: string;
  };
}) => {
  const [formData, setFormData] = useState({
    name: searchParams.name,
    description: searchParams.description,
    price: parseFloat(searchParams.price),
    stockQuantity: parseInt(searchParams.stockQuantity),
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

  const handleEditProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) {
      return;
    }
    
    setButtonDisabled(true);
    console.log(formData);
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${searchParams.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Product updated");
        setFormData({
          name: "",
          description: "",
          price: 0,
          stockQuantity: 0,
        });

        router.push(`/products/`);
      } else {
        console.error("Error updating product:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }finally {
      setButtonDisabled(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Edit Product</h1>

      <form onSubmit={handleEditProductSubmit}>
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
          <button
            className="btn btn-info w-full max-w-xl"
            type="submit"
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
