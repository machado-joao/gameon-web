import React from "react";
import { useRouter } from "next/router";

import { AiOutlineLoading } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";
import { MdLocalShipping, MdPayment } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";

const iconSteps = [
  {
    path: "login",
    display: "Autenticação",
    icon: RiLoginBoxLine,
  },
  {
    path: "shipping",
    display: "Endereço de entrega",
    icon: MdLocalShipping,
  },
  {
    path: "payment",
    display: "Método de pagamento",
    icon: MdPayment,
  },
  {
    path: "placeOrder",
    display: "Revisão da compra",
    icon: BsCartCheckFill,
  },
];

function CheckoutWizard({ activeStep = 0 }) {
  const router = useRouter();

  return (
    <div className="my-2 flex flex-wrap gap-x-3">
      {iconSteps?.map((step, index) => (
        <div
          key={step.path}
          className={`flex-1 border-b-4 text-center text-2xl 
                        ${index <= activeStep
              ? "border-blue-800 text-blue-800"
              : "border-gray-400 text-gray-400"
            }
         `}
        >
          <span
            onClick={() => router.push(`/${step.path}`)}
            className="cursor-pointer card py-3 !flex !flex-col !items-center"
          >
            {step.display}
            <i>
              {index == activeStep ? (
                <AiOutlineLoading className="rotate" />
              ) : (
                <step.icon />
              )}
            </i>
          </span>
        </div>
      ))}
    </div>
  );
}

export default CheckoutWizard;
