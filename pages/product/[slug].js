import React, { useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import db from "../../utils/db";
import Product from "../../models/Product";
import { Store } from "../../utils/Store";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../components/Layout";
import ResponseHTTP404 from "../../components/ResponseHTTP404";

import { BsXbox, BsPlaystation, BsNintendoSwitch } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";

function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product) {
    return (
      <Layout title="Produto não encontrado">
        <ResponseHTTP404 />
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error(
        <span className="p-2 text-red-600">
          Este produto está indisponível!
        </span>
      );
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.push("/cart");
  };

  if (product.countInStock === 0) {
    return (
      <div className="p-5 card bg-white">
        <div className="text-2xl text-red-600 text-center">
          <p>Produto esgotado!</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title={product.name}>
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0">
            <div className="h-96 relative">
              <Image
                alt={product.name}
                src={product.image}
                layout="responsive"
                objectFit="cover"
                height={150}
                width={150}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">
              {product.name}
            </h1>
            <div className="mb-2">
              <span className="text-gray-700 text-xl">Plataformas:</span>
            </div>
            <div className="flex mb-4">
              {product.platforms.includes("Xbox") && (
                <div className="flex items-center mr-4">
                  <BsXbox className="text-2xl text-green-500" />
                  <span className="ml-2 text-gray-700 text-xl font-medium">
                    Xbox
                  </span>
                </div>
              )}
              {product.platforms.includes("PlayStation") && (
                <div className="flex items-center mr-4">
                  <BsPlaystation className="text-2xl text-blue-500" />
                  <span className="ml-2 text-gray-700 text-xl font-medium">
                    PlayStation
                  </span>
                </div>
              )}
              {product.platforms.includes("Switch") && (
                <div className="flex items-center">
                  <BsNintendoSwitch className="text-2xl text-red-500" />
                  <span className="ml-2 text-gray-700 text-xl font-medium">
                    Nintendo Switch
                  </span>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-xl mr-2">Publicadora:</span>
              <span className="text-gray-700 text-xl">{product.publisher}</span>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-xl mr-2">Edição:</span>
              <span className="text-gray-700 text-xl">
                {product.edition.toUpperCase().charAt(0) +
                  product.edition.substring(1)}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-xl mr-2">Preço:</span>
              <span className="text-gray-700 text-xl">
                {`R$ ${product.price.toFixed(2)}`}
              </span>
            </div>
            {product.discount > 0 ? (
              <div className="mb-4">
                <span className="text-gray-700 text-xl mr-2">Desconto:</span>
                <span className="text-gray-700 text-xl">
                  {`${product.discount}%`}
                </span>
              </div>
            ) : (
              ""
            )}
            <button
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold rounded inline-flex items-center absolute right-0"
              onClick={addToCartHandler}
            >
              <AiOutlineShoppingCart size={24} />
              <span className="ml-2">Adicionar ao carrinho</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <h2 className="title">Descrição</h2>
        <p className="text-gray-600 text-lg mb-6">{product.description}</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

export default ProductScreen;
