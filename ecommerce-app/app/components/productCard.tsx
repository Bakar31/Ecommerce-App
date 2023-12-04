import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceTag from "./PriceTag";

interface Product {
  name: string;
  description: string;
  price: number;
  stockquantity: number;
  product_id: number;
  image_path: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductCard: React.FC<Product> = ({
  name,
  description,
  price,
  stockquantity,
  product_id,
  image_path,
}) => {
  const src = `http://localhost:8000${image_path}`;
  return (
    <Link href={`/products/${product_id}`}>
      <div className="card w-96 bg-base-110 shadow-xl hover: transition">
        {image_path && image_path.trim() !== "" ? (
          <Image
            loader={() => src}
            src={src}
            width={800}
            height={400}
            alt={name}
            className="h-48 object-cover"
          />
        ) : (
          <Image
            src="/products/default.jpg"
            width={800}
            height={400}
            alt="Default"
            className="h-48 object-cover"
          />
        )}

        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>{description.slice(0, 50)}</p>
          <PriceTag price={price} />
          <div className="card-actions justify-end">
            <button className="btn btn-success">Buy Now</button>
          </div>
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
          product_id={product.product_id}
          image_path={product.image_path}
        />
      ))}
    </div>
  );
};

export default ProductList;
