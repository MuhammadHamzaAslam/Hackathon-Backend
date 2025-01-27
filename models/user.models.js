import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cnic: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Auto-generated initially
    role: { type: String, enum: ["user", "admin"], default: "user" },
    city: { type: String },
    country: { type: String },
    isResetPassword: {type: Boolean , default: false}
  },
  { timestamps: true }
);

let UserModal = mongoose.model("user", userSchema)

export default UserModal
