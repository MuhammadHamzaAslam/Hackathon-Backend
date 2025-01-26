import express from "express"
import { getAllRequest, getCurrentUserRequest, submitLoanForm, updateLoanRequest } from "../controllers/loan.controller.js"

let loanRouter = express.Router()

loanRouter.post("/applyLoan", submitLoanForm)
loanRouter.post("/reviewForm", updateLoanRequest)
loanRouter.get("/getAllRequest", getAllRequest)
loanRouter.get("/getuserRequest/:userID" , getCurrentUserRequest)

export default loanRouter