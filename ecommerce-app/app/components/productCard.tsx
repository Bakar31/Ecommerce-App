import Link from "next/link";
import React from "react";

interface Product {
  name: string;
  description: string;
  price: number;
  stockquantity: number;
  product_id: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductCard: React.FC<Product> = ({
  name,
  description,
  price,
  stockquantity,
  product_id
}) => {
  return (

    <Link className="card w-80 bg-base-90 shadow-xl" href={`/products/${product_id}`}>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <p>Price: ${price}</p>
        <p>Stock: {stockquantity}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-success">Buy Now</button>
        </div>
      </div>
    </Link>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          description={product.description}
          price={product.price}
          stockquantity={product.stockquantity}
          product_id = {product.product_id}
        />
      ))}
    </div>
  );
};

export default ProductList;
