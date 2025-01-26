import express from "express";
import { addCategory,deleteCategory,editCategory, getAllCategories } from "../controllers/category.controller.js";


const CategpryRouter = express.Router();

// Add a new category
CategpryRouter.post("/add", addCategory);

// Edit an existing category
CategpryRouter.put("/edit/:id", editCategory);

// Delete a category
CategpryRouter.delete("/delete/:id", deleteCategory);

CategpryRouter.get("/getAllCategories", getAllCategories);

export default CategpryRouter;
