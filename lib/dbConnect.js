import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );
    console.log("DataBase Connected Successfully!");
  } catch (e) {
    console.log("error agaya", e, "error agaya");
  }
}
