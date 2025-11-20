import express from "express";
import { getIngredientByName } from "../controllers/IngredientController.js";

const router = express.Router();

router.get("/", getIngredientByName);

export default router;
