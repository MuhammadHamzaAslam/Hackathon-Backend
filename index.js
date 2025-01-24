import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";
import { connectDB } from "./lib/connectDB.js";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
dotenv.config();

const arr = [
  {
    projectName: "Hackathon",
    date: Date.now(),
  },
];

app.get("/", (req, res) => {
  res.send(arr);
});

app.use("/api/user", UserRouter);

app.listen(PORT, () => {
  console.log("Server is running on 4000");
  connectDB();
});
