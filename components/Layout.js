import React, { useContext, useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";

import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import "remixicon/fonts/remixicon.css";
import { ToastContainer } from "react-toastify";

import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";
import { BsArrowUpCircleFill } from "react-icons/bs";

import DashboardLinks from "./DashboardLinks";
import DropdownLink from "./DropdownLink";
import Footer from "./Footer";

function Layout({ title, children }) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const search = () => {
    router.push(`/search?query=${searchTerm}`);
  };

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const homeRef = useRef(null);
  const navRef = useRef(null);
  const rocketRef = useRef(null);

  const homeFunc = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      homeRef.current.classList.add("home-shrink");
      navRef.current.classList.add("nav-shrink");
      rocketRef.current.classList.add("open");
    } else {
      homeRef.current.classList.remove("home-shrink");
      navRef.current.classList.remove("nav-shrink");
      rocketRef.current.classList.remove("open");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", homeFunc);
    return () => window.removeEventListener("scroll", homeFunc);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="GameOn" content="E-commerce de jogos eletrônicos." />
        <meta
          name="description"
          content="E-commerce de jogos eletrônicos de mídia física."
        />
        <meta
          name="keywords"
          content="Comércio eletrônico, loja de jogos, loja de games, loja eletrônica, games, jogos, mídia física."
        />
        <meta
          name="author"
          content="Ariel Paixão, Carlos Junior e João Machado"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/white-controller.svg" />
      </Head>

      <ToastContainer position="bottom-center" limit={2} />

      <div className="flex flex-col justify-between">
        <header ref={homeRef}>
          <nav
            ref={navRef}
            className="relative w-full flex flex-wrap items-center justify-between py-1 bg-white text-gray-500 shadow-lg"
          >
            <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
              <div className="container-fluid">
                <Link href="/">
                  <div className="text-blue-800 cursor-pointer text-5xl">
                    <span>Ga</span>
                    <Image
                      alt="Um ícone de um controle no formato da letra 'M' do alfabeto"
                      src="/images/controller.svg"
                      width={45}
                      height={25}
                    />
                    <span>e</span>
                    <span className="bg-blue-800 rounded-lg text-white text-5xl">
                      On
                    </span>
                  </div>
                </Link>
              </div>
              <div className="relative w-full max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    search();
                  }}
                >
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 focus:outline-none focus:shadow-outline hover:text-white hover:bg-blue-800"
                  >
                    Pesquisar
                  </button>
                  <input
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 focus:ring-opacity-50"
                    type="text"
                    placeholder="Procurando algum jogo em específico?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
              <div className="flex gap-x-3">
                <Link href="/cart">
                  <div className="shadow border items-center outline-none border-gray-300 shadow-gray-300 px-3 py-2 my-2 cursor-pointer flex text-blue-800 bg-white rounded-lg hover:text-white hover:bg-blue-800 text-2xl">
                    {cartItemsCount > 0 && (
                      <ul className="flex items-center">
                        <li className="bg-red-600 text-white px-2 py-1 rounded-full h-fit text-xs">
                          {cartItemsCount}
                        </li>
                      </ul>
                    )}
                    <AiOutlineShoppingCart size={24} />
                  </div>
                </Link>
                {status === "loading" ? (
                  "Carregando..."
                ) : session?.user ? (
                  <Menu as="div" className="relative inline-block items-center">
                    <Menu.Button className="text-blue-800 flex flex-wrap text-xl border border-solid border-gray-300">
                      <div className="container-fluid text-center flex">
                        <span className="px-3 text-2xl">
                          {session?.user?.name}
                        </span>
                      </div>
                    </Menu.Button>
                    <Menu.Items className="absolute z-20 right-0 m-2 w-56 origin-top-right bg-white shadow-xl">
                      {!session?.user.isAdmin && (
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link m-2 rounded-md"
                            href="/orderHistory"
                          >
                            Histórico de compras
                          </DropdownLink>
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        <a
                          className="dropdown-link m-2 rounded-md"
                          href="#"
                          onClick={logoutClickHandler}
                        >
                          Sair
                        </a>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <Link href="/login">
                    <div className="shadow border outline-none border-gray-300 shadow-gray-300 px-3 py-2 tranform-y-0.5 my-2 cursor-pointer flex text-blue-800 bg-white rounded-lg hover:text-white hover:bg-blue-800 text-2xl">
                      <RiLoginBoxLine size={24} />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </header>
        {session?.user?.isAdmin ? (
          <div className="fixed top-1/3 z-50">
            <DashboardLinks />
          </div>
        ) : (
          ""
        )}
        <main>
          <div className="container min-h-screen m-auto mt-8 px-0">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      <button
        ref={rocketRef}
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
        className="scroll-top scroll-to-target open hover:bg-white hover:text-blue-800"
      >
        <BsArrowUpCircleFill className="relative -left-2 text-2xl" size={24} />
      </button>
    </>
  );
}

export default Layout;
