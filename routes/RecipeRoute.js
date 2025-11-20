import express from "express";
import {
  getAllRecipes,
  getRecipesByName,
  getRecipesByIngredients,
  getBookmarkedRecipes,
  editRecipe,
  deleteRecipe,
  toggleBookmark,
  addIngredientsToRecipe,
  createRecipe
} from "../controllers/RecipeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/search", getRecipesByName);
router.get("/by-ingredients", getRecipesByIngredients);
router.get("/bookmarked", protect, getBookmarkedRecipes); 

router.post("/", protect, admin, createRecipe); 
router.put("/:recipe_id", protect, admin, editRecipe); 
router.delete("/:recipe_id", protect, admin, deleteRecipe); 

router.put("/bookmark/:recipeId", protect, toggleBookmark);
router.put("/add-ingredients/:recipeId", protect, addIngredientsToRecipe);

export default router;
