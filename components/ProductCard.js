import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { TbDiscount2 } from "react-icons/tb";
import { AiOutlineShoppingCart } from "react-icons/ai";

function ProductCard({ props, addToCartHandler }) {
  const { image, name, slug, discount, price, countInStock } = props;
  const [totalAvailable, setTotalAvailable] = useState(countInStock);

  const handleAddToCard = () => {
    if (countInStock > 0 || totalAvailable > 0) {
      addToCartHandler(props);
      setTotalAvailable(totalAvailable - 1);
    } else {
      toast.error("Produto indisponível!");
    }
  };

  return (
    <div className="relative max-w-sm rounded overflow-hidden shadow-lg">
      <Link href={`/product/${slug}`}>
        <div className="relative h-64 cursor-pointer hover:scale-95">
          <Image
            alt={name}
            className="rounded-t"
            src={image}
            layout="fill"
            objectFit="cover"
          />
          {discount > 0 && (
            <div className="absolute top-0 right-0 bg-blue-800 text-white px-2 py-1 rounded-bl items-center flex">
              <TbDiscount2 size={20} />
              <span className="ml-1">Em promoção</span>
            </div>
          )}
        </div>
      </Link>
      <div className="px-6 py-4">
        <div className="font-bold text-2xl text-center mb-2 text-blue-800">
          {name}
        </div>
        <div className="h-full w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="text-2xl font-bold">
              {discount > 0 ? (
                <span className="text-gray-600 mb-5 relative">{`Preço: R$ ${(
                  price -
                  price * (discount / 100)
                ).toFixed(2)}`}</span>
              ) : (
                <span className="text-gray-600 relative">{`Preço: R$ ${price.toFixed(
                  2
                )}`}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-2">
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-4 rounded inline-flex items-center bottom-0"
          onClick={handleAddToCard}
        >
          <AiOutlineShoppingCart size={24} />
          <span className="ml-2">Adicionar ao carrinho</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
