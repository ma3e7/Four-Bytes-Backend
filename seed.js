import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/UserModel.js";
import Ingredient from "./models/IngredientModel.js";
import Recipe from "./models/RecipeModel.js";
import Review from "./models/ReviewModel.js";
import Note from "./models/NoteModel.js";

console.log("🌱 Seeding database...");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");

    // Clear database
    await User.deleteMany({});
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    await Review.deleteMany({});
    await Note.deleteMany({});

    // USERS
    const user1 = await User.create({
      username: "marko",
      password: "1234",
      role: "user",
    });

    const user2 = await User.create({
      username: "ana",
      password: "pass",
      role: "user",
    });

    const adminUser = await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    // INGREDIENTS
    const ingSalt = await Ingredient.create({ name: "Salt" });
    const ingSugar = await Ingredient.create({ name: "Sugar" });
    const ingBeans = await Ingredient.create({ name: "Beans" });
    const ingTomato = await Ingredient.create({ name: "Tomato" });
    const ingOnion = await Ingredient.create({ name: "Onion" });

    // RECIPES
    const recipe1 = await Recipe.create({
      name: "Slatko od dunja",
      description: "Tradicionalni domaći recept",
      image: "https://sadnicedunje.rs/wp-content/uploads/2020/10/slatko-od-rendanih-dunja.jpg",
      cookingTime: 70,
      complexity: 3,
      ingredients: [ingSugar._id, ingSalt._id],
      bookmarked: false,
      notes: [],
      reviews: [],
    });

    const recipe2 = await Recipe.create({
      name: "Pasulj",
      description: "Domaći kuvani pasulj",
      image: "https://fagor.rs/wp-content/uploads/2021/09/corbast-pasulj.jpg.webp",
      cookingTime: 90,
      complexity: 3,
      ingredients: [ingBeans._id, ingSalt._id, ingOnion._id],
      bookmarked: false,
      notes: [],
      reviews: [],
    });

    const recipe3 = await Recipe.create({
      name: "Salata od paradajza",
      description: "Brza i osvežavajuća salata",
      image: "https://example.com/salata.jpg",
      cookingTime: 10,
      complexity: 1,
      ingredients: [ingTomato._id, ingOnion._id, ingSalt._id],
      bookmarked: true,
      notes: [],
      reviews: [],
    });

    // Connect ingredients to recipes
    await Ingredient.findByIdAndUpdate(ingSalt._id, {
      recipes: [recipe1._id, recipe2._id, recipe3._id],
    });

    await Ingredient.findByIdAndUpdate(ingSugar._id, { recipes: [recipe1._id] });
    await Ingredient.findByIdAndUpdate(ingBeans._id, { recipes: [recipe2._id] });
    await Ingredient.findByIdAndUpdate(ingTomato._id, { recipes: [recipe3._id] });
    await Ingredient.findByIdAndUpdate(ingOnion._id, { recipes: [recipe2._id, recipe3._id] });

    // NOTES
    const note1 = await Note.create({
      user: user1._id,
      recipe: recipe2._id,
      text: "Probati dodati više bibera",
    });
    await Recipe.findByIdAndUpdate(recipe2._id, { $push: { notes: note1._id } });

    const note2 = await Note.create({
      user: user2._id,
      recipe: recipe3._id,
      text: "Dodati maslinovo ulje za bolji ukus",
    });
    await Recipe.findByIdAndUpdate(recipe3._id, { $push: { notes: note2._id } });

    // REVIEWS
    const review1 = await Review.create({
      user: user2._id,
      recipe: recipe1._id,
      rating: 5,
      comment: "Savršen recept!",
    });
    await Recipe.findByIdAndUpdate(recipe1._id, { $push: { reviews: review1._id } });

    const review2 = await Review.create({
      user: user1._id,
      recipe: recipe2._id,
      rating: 4,
      comment: "Dobar pasulj, ali malo slano",
    });
    await Recipe.findByIdAndUpdate(recipe2._id, { $push: { reviews: review2._id } });

    const review3 = await Review.create({
      user: adminUser._id,
      recipe: recipe3._id,
      rating: 5,
      comment: "Odlična i osvežavajuća salata!",
    });
    await Recipe.findByIdAndUpdate(recipe3._id, { $push: { reviews: review3._id } });

    console.log("✨ SEED COMPLETED!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seed();
