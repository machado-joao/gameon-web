import { useContext } from "react";
import { Store } from "../utils/Store";
import db from "../utils/db";
import Product from "../models/Product";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../components/Layout";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error("Este produto está esgotado!");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success("O produto foi adicionado ao carrinho!");
  };

  return (
    <Layout title="Home">
      <Hero />
      <h1 className="title">Catálogo de jogos</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => (
          <ProductCard
            props={product}
            key={product._id}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
