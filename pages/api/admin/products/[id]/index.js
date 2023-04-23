import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Acesse sua conta!");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Método não permitido!" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.image = req.body.image;
    product.slug = req.body.slug;
    product.description = req.body.description;
    product.publisher = req.body.publisher;
    product.edition = req.body.edition;
    product.platforms = req.body.platforms;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.countInStock = req.body.countInStock;
    await product.save();
    await db.disconnect();
    res.send({ message: "Produto cadastrado com sucesso!" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Produto não encontrado!" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Produto deletado com sucesso!" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Produto não encontrado!" });
  }
};

export default handler;
