import express from "express"
import { getAllUsers, SignUpNewUser,LoginNewUser, ResetPassword } from "../controllers/auth.controllers.js";

let authRouter = express.Router();

authRouter.post("/signup", SignUpNewUser)
authRouter.post("/login" , LoginNewUser)
authRouter.get("/allUsers", getAllUsers)
authRouter.post("/resetPassword", ResetPassword)



export default authRouter