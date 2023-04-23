import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

const handler = async (req, res) => {
  if (req.method === "GET" && req.query.query) {
    return getFilteredProducts(req, res);
  }

  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res
      .status(401)
      .send("Se você for um administrador, acesse sua conta.");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Método não permitido!" });
  }
};

const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "Nome",
    slug: "URL" + Math.random() * 100,
    image: "/images/controller.svg",
    description: "Descrição",
    publisher: "Publicadora",
    edition: "Edição",
    platforms: [],
    rating: 0,
    price: 0,
    discount: 0,
    countInStock: 0,
    sellCount: 0,
    available: 0,
    reserved: 0,
  });
  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Produto criado com sucesso!", product });
};

const getFilteredProducts = async (req, res) => {
  await db.connect();
  const products = await Product.find({
    name: { $regex: req.query.query, $options: "i" },
  });
  await db.disconnect();
  res.send(products);
};

const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};

export default handler;
