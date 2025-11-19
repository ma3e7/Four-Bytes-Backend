const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipe: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Recipe", 
      required: true 
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
