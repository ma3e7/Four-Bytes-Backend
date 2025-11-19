const ReviewModel = require("../models/ReviewModel");

exports.getReviewsByRecipe = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ recipe: req.params.recipeId })
      .populate("user", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await ReviewModel.create({
      user: req.user.id,  
      recipe: req.params.recipeId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.editReview = async (req, res) => {
  try {
    const review = await ReviewModel.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(403).json({ error: "Not allowed" });
    }

    review.comment = req.body.comment || review.comment;
    review.rating = req.body.rating || review.rating;

    await review.save();
    res.json(review);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
