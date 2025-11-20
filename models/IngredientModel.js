import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
});

export default mongoose.model('Ingredient', ingredientSchema);
