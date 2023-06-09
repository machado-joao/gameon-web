import { useSession } from "next-auth/react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../components/Layout";

import { BsPaypal, BsStripe } from "react-icons/bs";
import { MdPix } from "react-icons/md";
import { BiBarcodeReader } from "react-icons/bi";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "BRL",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: itemsPrice, currency: "BRL" },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("O pedido foi entregue!");
    } catch (error) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Pagamento efetuado com sucesso!");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  }

  function onError(error) {
    toast.error(getError(error));
  }

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;
  const totalDiscount = totalPrice;

  return (
    <Layout title="Pedido">
      <div className="card border border-gray-300 p-5">
        <h1 className="title">{`Número do pedido: ${orderId}`}</h1>
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div className="grid md:grid-cols-8 md:gap-6">
            <div className="overflow-x-auto md:col-span-5">
              <div className="text-center border border-gray-300 mb-5 overflow-x-auto p-5">
                <h2 className="mb-2 text-blue-800 text-3xl">
                  Lista de produtos
                </h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr className="text-black text-xl">
                      <th className="px-5 text-center">Nome do produto</th>
                      <th className="p-5 text-center">Quantidade</th>
                      <th className="p-5 text-center">Preço unitário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-y divide-black border-black"
                      >
                        <td className="p-5 text-xl only:text-center">
                          {item.name}
                        </td>
                        <td className="p-5 text-xl only:text-center">
                          {item.quantity}
                        </td>
                        <td className="p-5 text-xl text-center">
                          R$&nbsp;
                          {item.discount > 0
                            ? (
                                item.price -
                                item.price * (item.discount / 100)
                              ).toFixed(2)
                            : item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between gap-5">
                <div className="w-full border border-gray-300 p-5">
                  <h2 className="mb-2 text-blue-800 text-center text-3xl">
                    Endereço
                  </h2>
                  <div className="flex text-xl justify-between gap-2 mb-2">
                    <div className="flex justify-between items-start flex-col">
                      <span className="text-blue-700">
                        Nome:&nbsp;
                        <span className="text-black">
                          {shippingAddress.name}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        Rua:&nbsp;
                        <span className="text-black">
                          {`${shippingAddress.address}, ${shippingAddress.number}`}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        Bairro:&nbsp;
                        <span className="text-black">
                          {shippingAddress.neighborhood}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        Cidade:&nbsp;
                        <span className="text-black">
                          {shippingAddress.city}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        CEP:&nbsp;
                        <span className="text-black">
                          {shippingAddress.postalCode}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        UF:&nbsp;
                        <span className="text-black">
                          {shippingAddress.state}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center flex-col">
                    {isDelivered ? (
                      <div className="alert-success">
                        Entregue {deliveredAt.substring(11, 19)} do dia{" "}
                        {deliveredAt.substring(8, 10)}/
                        {deliveredAt.substring(5, 7)}/
                        {deliveredAt.substring(0, 4)}.
                      </div>
                    ) : (
                      <div className="alert-error">Não entregue</div>
                    )}
                  </div>
                </div>
                <div className="w-full border border-gray-300 p-5">
                  <div className="flex flex-col justify-between h-full">
                    <h2 className="mb-2 text-blue-800 text-center text-3xl">
                      Pagamento
                    </h2>
                    <div className="mb-2 text-xl text-center">
                      {paymentMethod === "PayPal" ||
                      paymentMethod === "Paypal" ? (
                        <div className="flex justify-center items-center">
                          {paymentMethod}
                          <BsPaypal size={24} />
                        </div>
                      ) : paymentMethod === "Stripe" ? (
                        <div className="flex justify-center items-center">
                          {paymentMethod} <BsStripe size={24} />
                        </div>
                      ) : paymentMethod === "PIX" ? (
                        <div className="flex justify-center items-center">
                          {paymentMethod} <MdPix size={24} />
                        </div>
                      ) : paymentMethod === "Boleto" ? (
                        <div className="flex justify-center items-center">
                          {paymentMethod} <BiBarcodeReader size={24} />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center flex-col">
                      {isPaid ? (
                        <div className="alert-success">
                          Pago às {paidAt.substring(11, 19)} do dia{" "}
                          {paidAt.substring(8, 10)}/{paidAt.substring(5, 7)}/
                          {paidAt.substring(0, 4)}.
                        </div>
                      ) : (
                        <div className="alert-error">Não confirmado</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto md:col-span-3">
              <div className="bg-white shadow-md rounded-lg p-5 border border-gray-300">
                <h2 className="mb-2 text-blue-800 text-center text-3xl">
                  Resumo do pedido
                </h2>
                <ul>
                  <li>
                    <div className="mb-2 gap-5 text-xl flex justify-between">
                      <div>Produtos</div>
                      <div>R$&nbsp;{itemsPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex text-xl justify-between">
                      <div>Total</div>
                      <div className="flex flex-col align-middle items-end">
                        <span className="text-xl text-black">
                          R$&nbsp;
                          {totalDiscount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Carregando...</div>
                      ) : (
                        <div className="w-full">
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Carregando...</div>}
                    </li>
                  )}
                  {session.user.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <li>
                        {loadingDeliver && <div>Carregando...</div>}
                        <button
                          className="primary-button text-xl bg-white w-full"
                          onClick={deliverOrderHandler}
                        >
                          Confirmar entrega
                        </button>
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

OrderScreen.auth = true;

export default OrderScreen;
