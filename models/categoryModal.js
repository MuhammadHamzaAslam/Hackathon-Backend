import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  subCategories: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const CategoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);
