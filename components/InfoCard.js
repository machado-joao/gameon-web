import { useRouter } from "next/router";
import Image from "next/image";

import { BsXbox, BsPlaystation, BsNintendoSwitch } from "react-icons/bs";

function InfoCard({ props }) {
  const product = props;
  const router = useRouter();

  return (
    <div
      className="flex py-7 px-2 border-b cursor-pointer hover:opacity-80 hover:shadow-lg transition duration-200 ease-out first:border-t"
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <div className="relative h-100vh w-100vh md:w-80 flex-shrink-0">
        <Image
          alt={product.name}
          className="rounded-xl"
          src={product.image}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col flex-grow pl-5">
        <div className="flex justify-between">
          <p className="text-blue-800 text-2xl">{product.name}</p>
        </div>
        <div className="border-b w-10 pt-2" />
        <div>
          <p className="pt-2 p-md p-black flex-grow text-gray-700">{`${product.description.substring(
            0,
            400
          )}...`}</p>
          <div className="mb-2 mt-3">
            <span className="text-gray-700 text-lg">Plataformas:</span>
          </div>
          <div className="flex mb-4">
            {product.platforms.includes("Xbox") && (
              <div className="flex items-center mr-4">
                <BsXbox className="text-xl text-green-500" />
                <span className="ml-2 text-gray-700 text-lg font-medium">
                  Xbox
                </span>
              </div>
            )}
            {product.platforms.includes("PlayStation") && (
              <div className="flex items-center mr-4">
                <BsPlaystation className="text-xl text-blue-500" />
                <span className="ml-2 text-gray-700 text-lg font-medium">
                  PlayStation
                </span>
              </div>
            )}
            {product.platforms.includes("Switch") && (
              <div className="flex items-center">
                <BsNintendoSwitch className="text-xl text-red-500" />
                <span className="ml-2 text-gray-700 text-lg font-medium">
                  Nintendo Switch
                </span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="text-gray-700 text-lg mr-2">Publicadora:</span>
            <span className="text-gray-700 text-lg">{product.publisher}</span>
          </div>
          <div className="mb-4">
            <span className="text-gray-700 text-lg mr-2">Edição:</span>
            <span className="text-gray-700 text-lg">
              {product.edition.toUpperCase().charAt(0) +
                product.edition.substring(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
