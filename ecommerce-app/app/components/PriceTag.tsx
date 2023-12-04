import React from "react";

function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

interface PriceTagProps {
  price: number;
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, className }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-md font-semibold leading-none text-blue-500 ${className}`}
    >
      $ {formatPrice(price)}
    </span>
  );
};

export default PriceTag;
