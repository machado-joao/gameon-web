import { model, Schema, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    // releaseDate: { type: Date, required: true },
    publisher: { type: String, required: true },
    edition: { type: String, required: true },
    // hasDownloadableContent: { type: Boolean, required: true },
    // downloadableContent: Array,
    // hasBonusContent: { type: Boolean, required: true },
    // bonusContent: Array,
    // isDubbed: { type: Boolean, required: true },
    platforms: Array,
    rating: Number,
    // categories: Array,
    price: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true },
    available: Number,
    reserved: Number,
    sellCount: { type: Number, default: 0 },
    /* reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
      comment: String,
      createdAt: Date,
    },
  ], */
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
