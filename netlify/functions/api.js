import serverless from 'serverless-http'
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import logger from "morgan";
import cors from "cors";

import authRoutes from "../../routes/AuthRoute.js";
import recipeRoutes from "../../routes/RecipeRoute.js";
import noteRoutes from "../../routes/NoteRoute.js";
import reviewRoutes from "../../routes/ReviewRoute.js";
import ingredientRoutes from "../../routes/IngredientRoute.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(logger("dev"));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/note", noteRoutes);
app.use("/reviews", reviewRoutes);
app.use("/ingredients", ingredientRoutes);

export const handler = serverless(app, {
    request: (req, event) => {
        if (typeof event.body === 'string') {
            try {
                req.body = JSON.parse(event.body);
            } catch (err) {
                req.body = {};
            }
        }
    }
});