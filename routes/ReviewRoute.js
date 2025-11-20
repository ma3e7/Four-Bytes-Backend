import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReviewsByRecipe, createReview, editReview, deleteReview } from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/:recipeId", getReviewsByRecipe);

router.use(protect);

router.post("/:recipeId", createReview);
router.put("/:reviewId", editReview);
router.delete("/:reviewId", deleteReview);

export default router;
