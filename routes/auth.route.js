import express from "express"
import { getAllUsers, SignUpNewUser,LoginNewUser } from "../controllers/auth.controllers.js";

let authRouter = express.Router();

authRouter.post("/signup", SignUpNewUser)
authRouter.post("/login" , LoginNewUser)
authRouter.get("/allUsers", getAllUsers)
export default authRouter