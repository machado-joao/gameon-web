import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../components/Layout";
import ReactTooltip from "react-tooltip";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function ProductsScreen() {
  const router = useRouter();
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm("Você tem certeza?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Produto deletado com sucesso!");
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(error));
    }
  };

  const createHandler = async () => {
    if (!window.confirm("Você tem certeza?")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Produto criado com sucesso!");
      router.push(`/admin/product/${data.product._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Produtos">
      <div className="grid md:grid-cols-6 md:gap-5">
        <div className="overflow-x-auto md:col-span-6">
          <div className="grid">
            <h1 className="title">Produtos</h1>
            {loadingDelete && <div>Deletando item...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="mb-4 grid-cols-1 text-center card py-2 text-blue-700 hover:bg-blue-700 text-2xl"
            >
              {loadingCreate ? (
                "Carregando..."
              ) : (
                <span className="text-3xl">Adicionar um novo produto</span>
              )}
            </button>
          </div>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto card text-xl">
              <table className="min-w-full text-center bg-white rounded-xl p-5 shadow-xl">
                <thead>
                  <tr className="text-2xl text-blue-800">
                    <th className="p-5 text-center">Produto</th>
                    <th className="p-5 text-center">Preço</th>
                    <th className="p-5 text-center">Desconto</th>
                    <th className="p-5 text-center">Quantidade</th>
                    <th className="p-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t text-center border-x-gray-400 border-t-gray-400 text-xl hover:bg-gray-100"
                    >
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">R$ {product.price.toFixed(2)}</td>
                      <td className="p-5">
                        {product.discount == 0 ? (
                          <span className="text-md text-red-500">
                            Sem desconto
                          </span>
                        ) : (
                          `${product.discount}%`
                        )}{" "}
                      </td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">
                        <Link href={`/admin/product/${product._id}`}>
                          <button className="bg-blue-800 hover:bg-blue-700 border text-white border-solid border-gray-300 w-15">
                            Editar
                          </button>
                        </Link>{" "}
                        <button
                          onClick={() => deleteHandler(product._id)}
                          type="button"
                          className="bg-blue-800 hover:bg-blue-700 text-white border border-solid border-gray-300 w-25"
                        >
                          Deletar
                        </button>
                      </td>
                      <ReactTooltip
                        delayHide={1000}
                        place="right"
                        type="info"
                        effect="solid"
                        backgroundColor="#2028b3"
                        textColor="#fff"
                        borderColor="#cbd5e0"
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

ProductsScreen.auth = { adminOnly: true };

export default ProductsScreen;
