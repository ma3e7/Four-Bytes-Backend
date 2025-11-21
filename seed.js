import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Ingredient from "./models/IngredientModel.js";
import Recipe from "./models/RecipeModel.js";

import fs from "fs";
import path from "path";

const ingredientsData = JSON.parse(
  fs.readFileSync(path.resolve("./ingredients.json"), "utf-8")
);
const recipesData = JSON.parse(
  fs.readFileSync(path.resolve("./recipes.json"), "utf-8")
);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");

    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    console.log("Cleared ingredients and recipes.");

    const createdIngredients = await Ingredient.insertMany(ingredientsData);
    console.log(`Inserted ${createdIngredients.length} ingredients.`);

    // Map ingredient names to their _id
    const ingredientMap = {};
    createdIngredients.forEach(ing => {
      ingredientMap[ing.name.toLowerCase()] = ing._id;
    });

    // Helper: normalize text (lowercase, remove punctuation)
    const normalize = (text) =>
      text.toLowerCase().replace(/[,;:.()\n]/g, " ");

    // Prepare recipes with ingredients detected in description
    const recipesToInsert = recipesData.map(recipe => {
      const normalizedDesc = normalize(recipe.description);
      const ingredientIds = [];

      for (const ing of createdIngredients) {
        const ingName = ing.name.toLowerCase();
        // simple match: check if ingredient name exists as whole word
        const regex = new RegExp(`\\b${ingName}\\b`, "i");
        if (regex.test(normalizedDesc)) {
          ingredientIds.push(ingredientMap[ingName]);
        }
      }

      return {
        ...recipe,
        ingredients: ingredientIds,
      };
    });

    const createdRecipes = await Recipe.insertMany(recipesToInsert);
    console.log(`Inserted ${createdRecipes.length} recipes.`);

    // Batch update ingredients to include recipes
    const ingredientRecipeMap = {};
    createdRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingId => {
        if (!ingredientRecipeMap[ingId]) ingredientRecipeMap[ingId] = [];
        ingredientRecipeMap[ingId].push(recipe._id);
      });
    });

    const bulkOps = Object.entries(ingredientRecipeMap).map(([ingId, recipeIds]) => ({
      updateOne: {
        filter: { _id: ingId },
        update: { $addToSet: { recipes: { $each: recipeIds } } }
      }
    }));

    if (bulkOps.length > 0) {
      await Ingredient.bulkWrite(bulkOps);
      console.log("Linked ingredients with recipes (batch update).");
    }

    console.log("✨ SEED COMPLETED!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seed();
