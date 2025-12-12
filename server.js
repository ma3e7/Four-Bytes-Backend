import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import logger from "morgan";
import cors from "cors";

import authRoutes from "./routes/AuthRoute.js";
import recipeRoutes from "./routes/RecipeRoute.js";
import noteRoutes from "./routes/NoteRoute.js";
import reviewRoutes from "./routes/ReviewRoute.js";
import ingredientRoutes from "./routes/IngredientRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.conneaction.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ingredients", ingredientRoutes);

export default app; 
