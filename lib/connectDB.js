import mongoose from "mongoose";

export async function connectDB() {
  let isConnected = false;
  if (isConnected) return console.log("DB Already Connected");

  try {
    let connectingToDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected Successfully");
    if (connectingToDB.connection.readyState === 1) isConnected = true;
  } catch (error) {
    console.log("error =>", error);
  }
}
