import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users`);
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

  const deleteHandler = async (userId) => {
    if (!window.confirm("Você tem certeza?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Usuário deletado com sucesso!");
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Usuários">
      <div className="grid md:grid-cols-6 md:gap-5">
        <div className="overflow-x-auto md:col-span-6">
          <h1 className="title">Usuários cadastrados</h1>
          {loadingDelete && <div>Deletando...</div>}
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto card">
              <table className="min-w-full text-center bg-white p-5 shadow-xl">
                <thead className="border-gray-400">
                  <tr className="text-2xl text-center text-blue-800">
                    <th className=" p-5">Nome</th>
                    <th className=" p-5">E-mail</th>
                    <th className=" p-5">Nível</th>
                    <th className=" p-5">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t text-center border-x-gray-400 border-y-gray-400 text-xl hover:bg-gray-100"
                    >
                      <td className="p-5">{user.name}</td>
                      <td className="p-5">{user.email}</td>
                      <td className="p-5">
                        {user.isAdmin ? "Administrador" : "Usuário"}
                      </td>
                      <td className="p-5">
                        <Link href={`/admin/user/${user._id}`} passHref>
                          <button className="bg-blue-800 border hover:bg-blue-700 text-white border-solid w-25">
                            Editar
                          </button>
                        </Link>
                        &nbsp;
                        <button
                          type="button"
                          className="bg-blue-800 hover:bg-blue-700 text-white border border-solid w-25"
                          onClick={() => deleteHandler(user._id)}
                        >
                          Deletar
                        </button>
                      </td>
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

AdminUsersScreen.auth = { adminOnly: true };

export default AdminUsersScreen;
