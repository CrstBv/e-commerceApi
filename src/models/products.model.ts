import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    constumer: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: { type: String },
    cuantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, default: "" },
    category: { type: String, require: true, index: true },
    available: { type: Boolean, default: true },
    discount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const Products = models.Products || model("Products", productSchema);

export default Products;
