import express from "express";
import { UserModal } from "../models/userModal.js";
import { comparePassword, hashPassword } from "../lib/helperFunction.js";

const UserRouter = express.Router();

// const allUser = [
//   {
//     userName: "Hamza",
//     email: "hamza@gmail.com",
//     password: "hamza123",
//   },
// ];

UserRouter.get("/allUser", async (req, res) => {
  const allUser = await UserModal.find();
  res.status(201).json({
    error: false,
    message: "All User Fetched",
    allUser,
  });
});

UserRouter.post("/signup", async (req, res) => {
  const { userName, email, password, gender } = req.body;
  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Plz fill all fileds" });
  }

  const checkExistingUser = await UserModal.findOne({ email });

  if (checkExistingUser) {
    return res.status(400).json({
      error: true,
      message: "User Already Exist",
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await UserModal({
    userName,
    email,
    password: hashedPassword,
    gender,
  });
  await newUser.save();

  res.status(201).json({
    error: false,
    message: "User Added Successfully",
    user: newUser,
  });
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please fill all fields" });
  }

  try {
    const checkingUser = await UserModal.findOne({ email });
    if (!checkingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User does not exist" });
    }

    const isMatch = await comparePassword(password, checkingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }

    res
      .status(201)
      .json({ error: false, message: "User successfully logged in" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

export default UserRouter;
