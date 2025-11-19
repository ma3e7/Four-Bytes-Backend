const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/UserModel");
const Ingredient = require("./models/IngredientModel");
const Recipe = require("./models/RecipeModel");
const Review = require("./models/ReviewModel");
const Note = require("./models/NoteModel");

console.log("🌱 Seeding database...");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");

    // Clear database (optional)
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

    // INGREDIENTS
    const ingSalt = await Ingredient.create({ name: "Salt" });
    const ingSugar = await Ingredient.create({ name: "Sugar" });
    const ingBeans = await Ingredient.create({ name: "Beans" });

    // RECIPES
    const recipe1 = await Recipe.create({
      name: "Slatko od dunja",
      description: "Tradicionalni domaći recept",
      image: "https://sadnicedunje.rs/wp-content/uploads/2020/10/slatko-od-rendanih-dunja.jpg",
      cookingTime: 70,
      complexity: 3,
      ingredients: [ingSugar._id, ingSalt._id],
      bookmarked: false
    });

    const recipe2 = await Recipe.create({
      name: "Pasulj",
      description: "Domaći kuvani pasulj",
      image: "https://fagor.rs/wp-content/uploads/2021/09/corbast-pasulj.jpg.webp",
      cookingTime: 90,
      complexity: 3,
      ingredients: [ingBeans._id, ingSalt._id],
      bookmarked: false
    });

    // Connect ingredients to recipes
    await Ingredient.findByIdAndUpdate(ingSalt._id, {
      recipes: [recipe1._id, recipe2._id],
    });

    await Ingredient.findByIdAndUpdate(ingSugar._id, {
      recipes: [recipe1._id],
    });

    await Ingredient.findByIdAndUpdate(ingBeans._id, {
      recipes: [recipe2._id],
    });

    // REVIEW
    await Review.create({
      user: user2._id,
      recipe: recipe1._id,
      rating: 5,
      comment: "Savršen recept!"
    });

    // NOTE
    await Note.create({
      user: user1._id,
      recipe: recipe2._id,
      text: "Probati dodati više bibera"
    });

    console.log("✨ SEED COMPLETED!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seed();
