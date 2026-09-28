import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "https://via.placeholder.com/300",
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
