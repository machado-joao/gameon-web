import React from "react";
import Link from "next/link";

import ReactTooltip from "react-tooltip";

import { FiBox, FiPackage, FiUsers } from "react-icons/fi";

function DashboardLinks() {
  return (
    <div className="card text-xl py-5 px-3">
      <ul className="flex flex-col mt-3 text-center align-middle items-center">
        <Link href="/admin/orders">
          <li
            className="card px-2 py-2 cursor-pointer !rounded-sm hover:scale-125 text-blue-800"
            data-tip="Pedidos"
          >
            <span>
              <FiPackage />
            </span>
          </li>
        </Link>
        <Link href="/admin/products">
          <li
            className="card px-2 py-2 cursor-pointer !rounded-sm hover:scale-125 text-blue-800"
            data-tip="Produtos"
          >
            <span>
              <FiBox />
            </span>
          </li>
        </Link>
        <Link href="/admin/users">
          <li
            className="card px-2 py-2 cursor-pointer !rounded-sm hover:scale-125 text-blue-800"
            data-tip="Usuários"
          >
            <span>
              <FiUsers />
            </span>
          </li>
        </Link>
      </ul>
      <ReactTooltip
        delayHide={1000}
        place="right"
        type="info"
        effect="solid"
        backgroundColor="#2028b3"
        textColor="#fff"
        borderColor="#cbd5e0"
      />
    </div>
  );
}

export default DashboardLinks;
