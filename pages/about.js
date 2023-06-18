import Layout from "../components/Layout";
import AboutCard from "../components/AboutCard";

const AUTHORS = [
  {
    id: 1,
    name: "Ariel Paixão",
    image: "/photos/aacp.jpg",
    title: "Desenvolvedor",
    responsabilities: "Web e banco de dados.",
    githubURL: "https://github.com/paixaoariellll",
    linkedinURL: "https://www.linkedin.com/in/ariel-paixao/",
  },
  {
    id: 2,
    name: "Carlos Junior",
    image: "/photos/cmoj.jpg",
    title: "Desenvolvedor",
    responsabilities: "Testes e implantação.",
    githubURL: "https://github.com/CarlosDevMarques",
    linkedinURL: "https://www.linkedin.com/in/carlos-marques-4b6aa31b5/",
  },
  {
    id: 3,
    name: "João Machado",
    image: "/photos/jlcm.jpg",
    title: "Desenvolvedor",
    responsabilities: "Web, mobile e documentação.",
    githubURL: "https://github.com/machado-joao",
    linkedinURL: "https://linkedin.com/in/machado-joao/",
  },
];

function AboutScreen() {
  return (
    <Layout title="Sobre">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AUTHORS?.map((author) => (
          <AboutCard key={author.id} props={author} />
        ))}
      </div>
    </Layout>
  );
}

export default AboutScreen;
