import mongoose from "mongoose";
import { model, Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      number: { type: String, required: true },
      neighborhood: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    itemsPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
