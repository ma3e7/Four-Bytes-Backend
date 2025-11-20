import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    cookingTime: { type: Number },
    complexity: { type: Number },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    bookmarked: { type: Boolean, default: false }
});

export default mongoose.model('Recipe', recipeSchema);
