import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subcategories: [{ type: String, required: true }],
    maxLoan: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

let CategoryModal = mongoose.model("category", categorySchema);

export default CategoryModal;
