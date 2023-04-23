import Link from "next/link";

function Footer() {
  return (
    <footer className="flex bg-white gap-x-5 justify-center items-center h-10 shadow-md mt-5">
      <div className="flex justify-between">
        <Link href="/about">Sobre nós</Link>
      </div>
      <p>
        Copyright &copy; {new Date().getFullYear()}, Game
        <span className="bg-blue-800 rounded-t-sm text-white">On</span>.
      </p>
    </footer>
  );
}

export default Footer;
