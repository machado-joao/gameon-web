import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <section className="bg-gray-900 rounded-sm">
      <div className="container mx-auto my-0 flex flex-col justify-center items-center md:flex-row">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Obtenha os jogos mais recentes agora!
          </h1>
          <p className="text-white text-lg md:text-xl mb-8">
            Encontre os seus jogos favoritos e aproveite os melhores negócios em
            nossa loja.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            alt="Personagem do jogo The Callisto Protocol"
            src="/images/hero.webp"
            priority
            objectFit="cover"
            layout="responsive"
            width={1000}
            height={900}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
