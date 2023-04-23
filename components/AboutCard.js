import React from "react";
import Image from "next/image";
import Link from "next/link";

import { FaGithub, FaLinkedin } from "react-icons/fa";

function AboutCard({ props }) {
  const { name, title, responsabilities, image, githubURL, linkedinURL } =
    props;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto">
      <div className="relative">
        <Image
          alt={name}
          src={image}
          priority
          objectFit="cover"
          layout="intrinsic"
          height={400}
          width={400}
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">{title}</p>
        <p className="text-gray-700 text-base">{responsabilities}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="flex justify-between">
          <Link href={githubURL}>
            <FaGithub className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer" />
          </Link>
          <Link href={linkedinURL}>
            <FaLinkedin className="text-2xl text-blue-500 hover:text-blue-700 cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutCard;
