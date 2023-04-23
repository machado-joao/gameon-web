import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import User from "../../../models/User";
import Product from "../../../models/Product";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Acesse sua conta!");
  }

  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$discount" },
      },
    },
  ]);
  const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesDataDiscount = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
        totalSales: { $sum: "$discount" },
      },
    },
  ]);
  const salesDataPrice = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  await db.disconnect();
  res.send({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesDataPrice,
    salesDataDiscount,
  });
};

export default handler;
