import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./lib/dbConnect.js"
import authRouter from "./routes/auth.route.js"
import loanRouter from "./routes/loan.route.js"
import CategpryRouter from "./routes/category.route.js"

let app = express()
let port = process.env.PORT


app.use(cors())
app.use(express.json())
dotenv.config()


app.use("/api/auth" , authRouter)
app.use("/api/loan" , loanRouter)
app.use("/api/category", CategpryRouter)


app.listen(4000 , () => {
    console.log("Server is running on port " + process.env.PORT)
    connectDB()
})