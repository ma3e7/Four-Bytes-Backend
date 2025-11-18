import { Recipe } from './models/RecipeModel.js';
const User = require("../models/UserModel");

// 1) GET ALL RECIPES
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("ingredients");
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2) GET BY NAME (live search)
exports.getRecipesByName = async (req, res) => {
    try {
        const { name } = req.query;

        const recipes = await Recipe.find({
            name: { $regex: name, $options: "i" }
        }).populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3) GET BY INGREDIENTS (list)
exports.getRecipesByIngredients = async (req, res) => {
    try {
        const { ingredients } = req.query;

        if (!ingredients) {
            return res.status(400).json({ message: "Ingredients required" });
        }

        const ingredientList = ingredients.split(",");

        const recipes = await Recipe.find({
            ingredients: { $all: ingredientList }
        }).populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4) GET BY BOOKMARKED (boolean)
exports.getBookmarkedRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ bookmarked: true })
            .populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5) EDIT RECIPE
exports.editRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;

        const updated = await Recipe.findByIdAndUpdate(
            recipe_id,
            req.body,
            { new: true }
        ).populate("ingredients");

        if (!updated) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 6) DELETE RECIPE
exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.recipe_id);
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
