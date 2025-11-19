const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    cookingTime: { type: Number },
    complexity: { type: Number },


    ingredients: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }
    ],

    bookmarked: { type: Boolean, default: false }
});

module.exports = mongoose.model("Recipe", RecipeSchema);
