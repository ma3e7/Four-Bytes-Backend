import Recipe from "../models/RecipeModel.js";
import Note from "../models/NoteModel.js";
import Review from "../models/ReviewModel.js";
import Ingredient from "../models/IngredientModel.js";

export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRecipeById = async (req, res) => {
    try {
        const { recipe_id } = req.params;
        const recipe = await Recipe.findById(recipe_id)
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRecipesByName = async (req, res) => {
    try {
        const { name } = req.query;
        const recipes = await Recipe.find({ name: { $regex: name, $options: "i" } })
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });
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

        const ingredientNames = ingredients.split(",").map(i => i.trim());

        const ingredientDocs = await Ingredient.find({
            name: { $in: ingredientNames }
        });

        if (ingredientDocs.length === 0) {
            return res.json([]); 
        }

        const ingredientIds = ingredientDocs.map(i => i._id);

        const recipes = await Recipe.find({
            ingredients: { $all: ingredientIds }
        })
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getBookmarkedRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ bookmarked: true })
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const editRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;
        const { _id, ...updateData } = req.body;

        const updatedRecipe = await Recipe.findByIdAndUpdate(recipe_id, updateData, { new: true })
            .populate("ingredients")
            .populate({ path: "notes", populate: { path: "user", select: "username" } })
            .populate({ path: "reviews", populate: { path: "user", select: "username" } });

        if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });

        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;

        const recipe = await Recipe.findById(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        await Promise.all([
            ...recipe.notes.map(id => Note.findByIdAndDelete(id)),
            ...recipe.reviews.map(id => Review.findByIdAndDelete(id))
        ]);

        await Recipe.findByIdAndDelete(recipe_id);

        return res.json({
            message: "Recipe and related notes/reviews deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const toggleBookmark = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.bookmarked = !recipe.bookmarked;
        await recipe.save();
        res.json({ message: `Recipe ${recipe.bookmarked ? "bookmarked" : "unbookmarked"}`, recipe });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addIngredientsToRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { ingredientIds } = req.body;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        for (const ingId of ingredientIds) {
            if (!recipe.ingredients.includes(ingId)) recipe.ingredients.push(ingId);
            await Ingredient.findByIdAndUpdate(ingId, { $addToSet: { recipes: recipe._id } });
        }

        await recipe.save();
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const { name, description, image, cookingTime, complexity, ingredientIds } = req.body;

        const recipe = new Recipe({
            name,
            description,
            image,
            cookingTime,
            complexity,
            ingredients: ingredientIds || [],
            bookmarked: false,
            notes: [],
            reviews: []
        });

        await recipe.save();

        if (ingredientIds && ingredientIds.length > 0) {
            for (const ingId of ingredientIds) {
                await Ingredient.findByIdAndUpdate(ingId, { $addToSet: { recipes: recipe._id } });
            }
        }

        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
