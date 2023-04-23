import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Layout from "../components/Layout";
import InfoCard from "../components/InfoCard";

function SearchScreen() {
  const router = useRouter();
  const { query } = router.query;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/admin/products?query=${query}`);
      setProducts(res.data);
    };
    fetchData();
  }, [query]);

  return (
    <Layout title="Resultados">
      <h1 className="title">Resultados</h1>
      {products && (
        <main className="flex">
          <section className="flex-grow pt-14 px-6">
            <div className="flex flex-col">
              {products?.map((product) => (
                <InfoCard key={product._id} props={product} />
              ))}
            </div>
          </section>
        </main>
      )}
    </Layout>
  );
}

export default SearchScreen;
