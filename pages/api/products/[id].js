import db from "../../../utils/db";
import Product from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { field, newCountInStock } = req.body;

    try {
      await db.connect();
      await Product.updateOne(
        { _id: id },
        { $set: { [field]: newCountInStock } }
      );
      await db.disconnect();
      res
        .status(200)
        .json({ message: "Quantidade em estoque atualizada com sucesso!" });
    } catch (error) {
      console.error(
        "Ocorreu um erro ao atualizar a quantidade em estoque!",
        error
      );
      res.status(500).json({
        message: "Ocorreu um erro ao atualizar a quantidade em estoque!",
      });
    }
  } else {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
  }
};

export default handler;
