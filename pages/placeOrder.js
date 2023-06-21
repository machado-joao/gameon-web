import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";

import { BsPaypal, BsStripe } from "react-icons/bs";
import { MdPix } from "react-icons/md";
import { BiBarcodeReader } from "react-icons/bi";

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const round = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round(
    cartItems
      .reduce(
        (a, c) => a + c.quantity * (c.price - (c.price * c.discount) / 100),
        0
      )
      .toFixed(2)
  );

  const shippingPrice = 0;
  const taxPrice = round(itemsPrice * 0);
  const discount = round(cartItems.reduce((a, c) => a + c.price, 0));
  const totalPrice = round(itemsPrice + shippingPrice + taxPrice);
  const totalDiscount = round(totalPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        discount,
      });
      const field = "countInStock";
      for (let i = 0; i < cartItems.length; i++) {
        let newCountInStock = cartItems[i].countInStock - cartItems[i].quantity;
        await axios.put(`/api/products/${cartItems[i]._id}`, {
          field,
          newCountInStock,
        });
      }
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Revisão do pedido">
      <CheckoutWizard activeStep={3} />
      <div className="card border border-gray-300 p-5">
        <h1 className="mb-4 text-center text-blue-800 text-5xl">
          Revisão do pedido
        </h1>
        {cartItems.length === 0 ? (
          <div className="card w-full p-5 bg-white">
            <h1 className="text-center text-red-600 text-3xl">
              Parece que você se perdeu, não é?
            </h1>
            {
              <div className="mb-4 text-xl text-center text-red-600">
                Você não possui produtos no carrinho!
              </div>
            }
            <div className="text-center">
              <button
                onClick={() => router.push("/")}
                type="button"
                className="primary-button text-xl"
              >
                Voltar para a página inicial
              </button>
            </div>
          </div>
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
                      <th className="px-5 text-center">Produto</th>
                      <th className="p-5 text-center">Quantidade</th>
                      <th className="p-5 text-center">Preço unitário</th>
                      <th className="p-5 text-center">Preço total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-y divide-black border-blak"
                      >
                        <td>
                          <Link href={`/product/${item.slug}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="cursor-pointer mt-2"
                              width={50}
                              height={50}
                            />
                          </Link>
                          <Link href={`/product/${item.slug}`}>
                            <p className="cursor-pointer !py-1 !px-0 hover:text-blue-600 hover:underline hover:underline-offset-1">
                              {item.name}
                            </p>
                          </Link>
                        </td>
                        <td className="p-5 text-xl only:text-center">
                          {item.quantity}
                        </td>
                        <td className="p-5 text-xl text-center">
                          R$&nbsp;
                          {(
                            item.price -
                            (item.price * item.discount) / 100
                          ).toFixed(2)}
                        </td>
                        <td className="p-5 text-xl text-center">
                          R$&nbsp;
                          {(
                            (item.price - (item.price * item.discount) / 100) *
                            item.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="justify-between">
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
                      <Link href="/shipping">
                        <div className="cursor-pointer bg-white w-fit text-blue-800 text-center rounded shadow-md py-2 px-2">
                          Editar
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="w-full border border-gray-300 p-5">
                    <div className="flex flex-col justify-between h-full">
                      <h2 className="mb-2 text-blue-800 text-center text-3xl">
                        Pagamento
                      </h2>
                      <div className="mb-2 text-xl text-center">
                        {paymentMethod === "PayPal" ? (
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
                        <Link href="/payment">
                          <div className="cursor-pointer bg-white w-fit text-blue-800 text-center rounded shadow-md py-2 px-2">
                            Editar
                          </div>
                        </Link>
                      </div>
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
                      <div>Itens</div>
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
                  <li>
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className="text-blue-800 text-2xl border border-gray-300 bg-white shadow-md w-full hover:bg-blue-700"
                    >
                      {loading ? "Carregando..." : "Finalizar a compra"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

PlaceOrderScreen.auth = true;

export default PlaceOrderScreen;
