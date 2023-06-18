import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { getError } from "../../utils/error";
import axios from "axios";

import Layout from "../../components/Layout";
import "remixicon/fonts/remixicon.css";
import ReactTooltip from "react-tooltip";

import { RxMagnifyingGlass } from "react-icons/rx";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Pedidos">
      <div className="grid md:grid-cols-6 md:gap-5">
        <div className="md:col-span-6">
          <h1 className="title">Pedidos</h1>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto card">
              <table className="min-w-full text-center bg-white rounded-xl p-5 shadow-xl">
                <thead>
                  <tr className="text-2xl text-blue-800">
                    <th className="p-5 text-center">Usuário</th>
                    <th className="p-5 text-center">Data da compra</th>
                    <th className="p-5 text-center">Total</th>
                    <th className="p-5 text-center">Status</th>
                    <th className="p-5 text-center">Data da entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t text-center border-t-gray-400 text-xl hover:bg-gray-100 justify-center"
                    >
                      <td className="p-5">
                        {order.user ? (
                          order.user.name
                        ) : (
                          <span className="text-md text-red-500">
                            Usuário deletado
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(8, 10)}/
                        {order.createdAt.substring(5, 7)}/
                        {order.createdAt.substring(0, 4)}
                      </td>
                      <td className="p-5">R$ {order.totalPrice.toFixed(2)}</td>
                      <td className="p-5">
                        {order.isPaid ? (
                          <span className="flex flex-col items-center w-full">
                            <span className="flex flex-col p-2 w-fit bg-green-300 rounded-xl">
                              <span>{order.paidAt.substring(11, 19)}</span>
                              <span>
                                {order.paidAt.substring(8, 10)}/
                                {order.paidAt.substring(5, 7)}/
                                {order.paidAt.substring(0, 4)}
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span className="bg-red-300 text-md text-black p-2 rounded-xl">
                            Não pago
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        {order.isDelivered ? (
                          <span className="flex flex-col items-center w-full">
                            <span className="flex flex-col p-2 w-fit bg-green-300 rounded-xl">
                              <span>{order.deliveredAt.substring(11, 19)}</span>
                              <span>
                                {order.deliveredAt.substring(8, 10)}/
                                {order.deliveredAt.substring(5, 7)}/
                                {order.deliveredAt.substring(0, 4)}
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span className="bg-red-300 text-md text-black p-2 rounded-xl">
                            Não entregue
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <span className="cursor-pointer">
                            <RxMagnifyingGlass size={24} />
                          </span>
                        </Link>
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

AdminOrderScreen.auth = { adminOnly: true };

export default AdminOrderScreen;
