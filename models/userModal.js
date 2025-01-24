import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, default: null },
    profilePicture: { type: String, default: null },
  },
  { timestamps: true }
);

export const UserModal =
  mongoose.models.users || mongoose.model("users", userSchema);
