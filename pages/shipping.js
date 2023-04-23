import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import { useForm } from "react-hook-form";

import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";

function ShippingScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("name", shippingAddress.name);
    setValue("address", shippingAddress.address);
    setValue("number", shippingAddress.number);
    setValue("neighborhood", shippingAddress.neighborhood);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("state", shippingAddress.state);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    name,
    address,
    number,
    neighborhood,
    city,
    postalCode,
    state,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { name, address, number, neighborhood, city, postalCode, state },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          name,
          address,
          number,
          neighborhood,
          city,
          postalCode,
          state,
        },
      })
    );
    router.push("/payment");
  };

  const checkCEP = (e) => {
    const cepValidate = e.target.value.replace(/\D/g, "");
    fetch(`https://viacep.com.br/ws/${cepValidate}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setValue("address", data.logradouro);
        setValue("neighborhood", data.bairro);
        setValue("city", data.localidade);
        setValue("state", data.uf);
      });
  };

  return (
    <Layout title="Endereço de entrega">
      <CheckoutWizard activeStep={1} />
      <div className="card w-full">
        <form
          className="mx-auto p-3 justify-center max-w-screen-md container"
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-5xl text-center text-blue-800">Endereço</h1>
          <div className="mb-4 grid col-span-1">
            <label className="text-xl text-black" htmlFor="name">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Seu nome completo"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-800 focus:outline-none"
              id="name"
              label="Nome completo"
              autoFocus
              {...register("name", {
                required: "Por favor, digite o seu nome completo.",
                minLength: {
                  value: 2,
                  message: "Por favor, digite ao menos dois caracteres.",
                },
                maxLength: {
                  value: 100,
                  message: "O seu nome não deve exceder cem caracteres.",
                },
              })}
              minLength={2}
              maxLength={100}
            />
            {errors.name && (
              <div className="text-red-600">{errors.name.message}</div>
            )}
          </div>
          <div className="flex gap-10 justify-between">
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="postalCode">
                CEP
              </label>
              <input
                type="text"
                placeholder="Seu CEP"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="postalCode"
                onBlurCapture={checkCEP}
                {...register("postalCode", {
                  required: "Por favor, digite o CEP.",
                  minLength: {
                    value: 8,
                    message: "O CEP deve conter no mínimo 8 números.",
                  },
                  maxLength: {
                    value: 8,
                    message: "O CEP deve conter apenas 8 números.",
                  },
                })}
                minLength={7}
                maxLength={9}
              />
              {errors.postalCode && (
                <div className="text-red-600">{errors.postalCode.message}</div>
              )}
            </div>
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="number">
                Número
              </label>
              <input
                type="number"
                placeholder="Número"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="number"
                {...register("number", {
                  required: "Por favor, digite o número de seu endereço",
                  minLength: {
                    value: 1,
                    message:
                      "O número informado deve ser maior que 1 (um) e, caso não possua número, preencha com 0 (zero).",
                  },
                })}
                min={1}
              />
              {errors.number && (
                <div className="text-red-600">{errors.number.message}</div>
              )}
            </div>
          </div>
          <div className="flex gap-10 justify-between">
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="address">
                Rua
              </label>
              <input
                type="text"
                placeholder="Nome da sua rua"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="address"
                {...register("address", {
                  required: "Por favor, digite o nome da sua rua.",
                })}
              />
              {errors.address && (
                <div className="text-red-600">{errors.address.message}</div>
              )}
            </div>
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="neighborhood">
                Bairro
              </label>
              <input
                type="text"
                placeholder="Nome do seu bairro"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="neighborhood"
                {...register("neighborhood", {
                  required: "Por favor, digite o nome do seu bairro.",
                })}
              />
              {errors.neighborhood && (
                <div className="text-red-600">
                  {errors.neighborhood.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-10 justify-between">
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="city">
                Cidade
              </label>
              <input
                type="text"
                placeholder="Nome da sua cidade"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="city"
                {...register("city", {
                  required: "Por favor, digite sua cidade.",
                })}
              />
              {errors.city && (
                <div className="text-red-600">{errors.city.message}</div>
              )}
            </div>
            <div className="mb-4 grid col-span-1">
              <label className="text-xl text-black" htmlFor="state">
                UF
              </label>
              <input
                type="text"
                placeholder="Sigla da sua UF"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                id="state"
                {...register("state", {
                  required: "Por favor, digite a sua UF.",
                  minLength: {
                    value: 2,
                    message: "Digite a UF no formato válido.",
                  },
                  maxLength: {
                    value: 2,
                    message: "Digite a UF no formato válido.",
                  },
                })}
                minLength={2}
                maxLength={2}
              />
              {errors.state && (
                <div className="text-red-600">{errors.state.message}</div>
              )}
            </div>
          </div>
          <div className="mb-4 text-end">
            <button className="primary-button border border-solid border-gray-300">
              Avançar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

ShippingScreen.auth = true;

export default ShippingScreen;
