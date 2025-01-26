import express from "express";
import { CategoryModel } from "../models/categoryModal.js";

const categoryRouter = express.Router();

categoryRouter.get("/getAll", async (req, res) => {
  try {
    const allCategory = await CategoryModel.find();
    res.status(201).json({
      error: false,
      message: "All categories Fetched",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

categoryRouter.post("/add-category", async (req, res) => {
  const { categoryName, subCategories } = req.body;
  try {
    if (!categoryName) {
      res.status(400).json({
        error: true,
        message: "Plz add category name!",
      });
    }

    const newCategory = await CategoryModel({
      categoryName,
      subCategories: subCategories || [],
    });

    await newCategory.save();

    res.status(201).json({
      error: false,
      message: "Category added successfully",
      newCategory,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

categoryRouter.put("/edit/:id", async (req, res) => {
  const { id } = req.params
  const { categoryName, subCategories  } = req.body;
  try {
    if (!categoryName || !subCategories) {
      res.status(400).json({
        error: true,
        message: "At least one thing should must be provided",
      });
    }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        ...(categoryName && { categoryName }),
        ...(subCategories && { subCategories }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(400).json("Category Not Found");
    }

    res.status(200).json({
      error: false,
      message: error.message,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

categoryRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params();
  try {
    const deleteCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deleteCategory) {
      res.status(400).json({
        error: true,
        message: "Category Not Found!",
      });
      return;
    }

    res.status(201).json({
      error: false,
      message: "Category Delete Successfully",
      data: deleteCategory,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: error.message,
    });
  }
});

export default categoryRouter