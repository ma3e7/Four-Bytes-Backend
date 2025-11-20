import Review from "../models/ReviewModel.js";
import Recipe from "../models/RecipeModel.js";


export const getReviewsByRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate("user", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user.id,
      recipe: req.params.recipeId,
      rating,
      comment,
    });

    await Recipe.findByIdAndUpdate(req.params.recipeId, { $push: { reviews: review._id } });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const editReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId, user: req.user.id });
    if (!review) return res.status(403).json({ error: "Not allowed" });

    review.comment = req.body.comment || review.comment;
    review.rating = req.body.rating || review.rating;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await Recipe.findByIdAndUpdate(review.recipe, { $pull: { reviews: review._id } });
    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
