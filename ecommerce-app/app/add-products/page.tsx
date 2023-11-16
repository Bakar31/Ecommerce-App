import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product - SazimStore",
};

const addProducts = () => {
  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Add New Products</h1>

      <form>
        <div className="mb-3">
          <input
            required
            name="name"
            type="text"
            placeholder="Product name"
            className="input input-bordered input-primary w-full max-w-xs"
          />
        </div>
        <div className="mb-3">
          <textarea
            required
            name="description"
            placeholder="Description"
            className="textarea textarea-secondary w-full max-w-xs"
          ></textarea>
        </div>

        <div className="mb-3">
          <input
            required
            name="price"
            type="number"
            placeholder="Price"
            className="input input-bordered input-success  w-full max-w-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="stock_quantity"
            type="number"
            placeholder="Quantity"
            className="input input-bordered input-accent w-full max-w-xs"
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-info w-full max-w-xs">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default addProducts;
