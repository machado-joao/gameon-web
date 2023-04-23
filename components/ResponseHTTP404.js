import Image from "next/image";
import Link from "next/link";

function ResponseHTTP404() {
  return (
    <div className="card flex items-center flex-col">
      <div className="text-5xl text-center">
        <h1 className="text-blue-800">Parece que não há nada por aqui!</h1>
        <div className="flex text-center">
          <Image
            alt="Um animal fantástico segura e morde o número zero do erro 404"
            className="vertical-image"
            src="/images/404.svg"
            height={500}
            width={500}
          />
          <Link href="/">
            <button className="error-404 bg-zinc-800 text-white hover:bg-red-800">
              {" "}
              Voltar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResponseHTTP404;
