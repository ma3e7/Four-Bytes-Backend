import RecipeModel from "../models/RecipeModel.js";

export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.find().populate("ingredients");
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecipesByName = async (req, res) => {
    try {
        const { name } = req.query;

        const recipes = await RecipeModel.find({
            name: { $regex: name, $options: "i" }
        }).populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecipesByIngredients = async (req, res) => {
    try {
        const { ingredients } = req.query;

        if (!ingredients) {
            return res.status(400).json({ message: "Ingredients required" });
        }

        const ingredientList = ingredients.split(",");

        const recipes = await RecipeModel.find({
            ingredients: { $all: ingredientList }
        }).populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookmarkedRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.find({
            bookmarked: true
        }).populate("ingredients");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;

        // spriječimo da korisnik promijeni _id
        const { _id, ...updateData } = req.body;

        const updatedRecipe = await RecipeModel.findByIdAndUpdate(
            recipe_id,
            updateData,
            { new: true }
        ).populate("ingredients");

        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;

        const deleted = await RecipeModel.findByIdAndDelete(recipe_id);

        if (!deleted) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
