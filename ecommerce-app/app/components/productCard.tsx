import Link from "next/link";
import React from "react";

interface Product {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  product_id: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductCard: React.FC<Product> = ({
  name,
  description,
  price,
  stock_quantity,
  product_id
}) => {
  return (

    <Link className="card w-80 bg-base-100 shadow-xl" href={`/products/${product_id}`}>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <p>Price: ${price}</p>
        <p>Stock: {stock_quantity}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </Link>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          description={product.description}
          price={product.price}
          stock_quantity={product.stock_quantity}
          product_id = {product.product_id}
        />
      ))}
    </div>
  );
};

export default ProductList;
