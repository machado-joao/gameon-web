import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { getError } from "../../../utils/error";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const uploadHandler = async (e, imageField = "image") => {
    const url = `https://api.cloudinary.com/v1_1/dins1fpk3/upload`;
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinarySign");
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", 368193629939789);
      const { data } = await axios.post(url, formData);
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      setImageSrc(data.secure_url);
      toast.success("Carregamento realizado com sucesso!");
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("image", data.image);
        setValue("description", data.description);
        setValue("publisher", data.publisher);
        setValue("edition", data.edition);
        setValue("platforms", data.platforms);
        setValue("price", data.price);
        setValue("discount", data.discount);
        setValue("countInStock", data.countInStock);
        setValue("sellCount", data.sellCount);
        setValue("available", data.available);
        setValue("reserved", data.reserved);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  const submitHandler = async ({
    name,
    slug,
    image,
    description,
    publisher,
    edition,
    platforms,
    price,
    discount,
    countInStock,
    available,
    reserved,
    sellCount,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        image,
        description,
        publisher,
        edition,
        platforms,
        price,
        discount,
        countInStock,
        available,
        reserved,
        sellCount,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Produto atualizado com sucesso!");
      router.push("/admin/products");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Edição de produto">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="md:col-span-4">
          <h1 className="mb-4 text-center py-2 card text-blue-700 text-2xl">{`Editando: ${productId}`}</h1>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto text-xl p-10 w-full card"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="flex justify-between gap-5">
                {/* Nome do produto */}
                <div className="mb-4 w-full">
                  <label htmlFor="name" className="text-2xl text-blue-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="name"
                    autoFocus
                    {...register("name", {
                      required: "Por favor, digite o nome do produto.",
                      minLength: {
                        value: 2,
                        message:
                          "Por favor, digite um nome com ao menos dois caracteres.",
                      },
                      maxLength: {
                        value: 25,
                        message:
                          "Por favor, digite um nome com no máximo 25 caracteres.",
                      },
                    })}
                    minLength={2}
                    maxLength={25}
                  />
                  {errors.name && (
                    <div className="text-red-600">{errors.name.message}</div>
                  )}
                </div>
              </div>

              {/* Slug do produto */}
              <div className="mb-4">
                <label htmlFor="slug" className="text-2xl text-blue-700">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="URL"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                  id="slug"
                  {...register("slug", {
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "É permitido apenas letras, números e hífens.",
                    },
                    required: "Por favor, forneça um slug.",
                    minLength: {
                      value: 2,
                      message: "Por favor, digite ao menos dois caracteres.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Por favor, digite no máximo 50 caracteres.",
                    },
                  })}
                  minLength={2}
                  maxLength={50}
                />
                {errors.slug && (
                  <div className="text-red-600">{errors.slug.message}</div>
                )}
              </div>

              {/* Imagem do produto */}
              <div className="flex justify-between">
                <div className="card p-5">
                  <Image
                    alt="Imagem adicionada para o produto"
                    src={imageSrc ? imageSrc : "/images/controller.svg"}
                    width={300}
                    height={300}
                    unoptimized
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="imageFile" className="text-2xl text-blue-700">
                    Carregar imagem
                  </label>
                  <input
                    type="file"
                    multiple
                    placeholder="Escolher arquivo"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="imageFile"
                    onChange={uploadHandler}
                  />
                  {loadingUpload && <div>Enviando...</div>}
                </div>
              </div>

              {/* Descrição do produto */}
              <div className="mb-4 w-full">
                <label htmlFor="description" className="text-2xl text-blue-700">
                  Descrição
                </label>
                <textarea
                  type="text"
                  placeholder="Descrição do produto"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                  id="description"
                  autoFocus
                  {...register("description", {
                    required: "Por favor, digite a descrição do produto.",
                  })}
                />
                {errors.name && (
                  <div className="text-red-600">{errors.name.message}</div>
                )}
              </div>

              {/* Publicadora do produto */}
              <div className="mb-4 w-full">
                <label htmlFor="publisher" className="text-2xl text-blue-700">
                  Publicadora
                </label>
                <input
                  type="text"
                  placeholder="Data de lançamento"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                  id="publisher"
                  autoFocus
                  {...register("publisher", {
                    required: "Por favor, digite a publicadora.",
                  })}
                />
                {errors.name && (
                  <div className="text-red-600">{errors.name.message}</div>
                )}
              </div>

              {/* Edição do produto */}
              <div className="mb-4 w-full">
                <label htmlFor="edition" className="text-2xl text-blue-700">
                  Edição
                </label>
                <select
                  placeholder="Edição"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                  id="edition"
                  autoFocus
                  {...register("edition", {
                    required: "Por favor, selecione a edição.",
                  })}
                >
                  <option value="deluxe">Deluxe</option>
                  <option value="gold">Gold</option>
                  <option value="standard">Standard</option>
                  <option value="ultimate">Ultimate</option>
                </select>
                {errors.name && (
                  <div className="text-red-600">{errors.name.message}</div>
                )}
              </div>

              {/* Plataformas do produto */}
              <div className="flex justify-between">
                <div className="mb-4">
                  <label htmlFor="platforms" className="text-2xl text-blue-700">
                    Plataformas
                  </label>
                  <select
                    placeholder="Plataformas"
                    className="form-control block w-52 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="platforms"
                    multiple
                    {...register("platforms", {
                      required: "Por favor, escolha ao menos uma plataforma.",
                    })}
                  >
                    <option id="platforms">Xbox</option>
                    <option id="platforms">PlayStation</option>
                    <option id="platforms">Switch</option>
                  </select>
                  {errors.platforms && (
                    <div className="text-red-600">
                      {errors.platforms.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Preço, desconto e quantidade de produtos em estoque */}
              <div className="flex justify-between">
                <div className="mb-4">
                  <label htmlFor="price" className="text-2xl text-blue-700">
                    Preço
                  </label>
                  <input
                    type="number"
                    placeholder="Valor em reais"
                    className="form-control block w-fit px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="price"
                    {...register("price", {
                      required: "Por favor, digite um valor válido.",
                      minLength: {
                        value: 1,
                        message: "O menor valor para o preço deve ser R$ 1,00.",
                      },
                    })}
                    min={1}
                  />
                  {errors.price && (
                    <div className="text-red-600">{errors.price.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="discount" className="text-2xl text-blue-700">
                    Desconto em %
                  </label>
                  <input
                    type="number"
                    placeholder="%"
                    className="form-control block w-fit px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="discount"
                    {...register("discount", {
                      required: "Por favor, digite um desconto válido.",
                    })}
                  />
                  {errors.descount && (
                    <div className="text-red-600">
                      {errors.descount.message}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="countInStock"
                    className="text-2xl text-blue-700"
                  >
                    Quantidade
                  </label>
                  <input
                    type="number"
                    placeholder="Quantidade disponível em estoque"
                    className="form-control block w-52 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:bg-blue-800 focus:border-blue-600 focus:outline-none"
                    id="countInStock"
                    {...register("countInStock", {
                      required:
                        "Por favor, digite a quantidade deste produto em estoque.",
                      minLength: {
                        value: 1,
                        message: "Deve haver ao menos um produto em estoque.",
                      },
                    })}
                    min={1}
                  />
                  {errors.countInStock && (
                    <div className="text-red-600">
                      {errors.countInStock.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="mb-4 flex justify-between">
                <button
                  onClick={() => `/admin/products`}
                  className="primary-button bg-white border border-solid border-gray-300"
                >
                  Voltar
                </button>
                <button
                  disabled={loadingUpdate}
                  className="primary-button bg-white border border-solid border-gray-300"
                >
                  {loadingUpdate ? "Carregando" : "Salvar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };

export default AdminProductEditScreen;
