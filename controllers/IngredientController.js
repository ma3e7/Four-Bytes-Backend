const Ingredient = require("../models/IngredientModel");

exports.getIngredientByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Name query required" });
        }

        const ingredients = await Ingredient.find({
            name: { $regex: name, $options: "i" }
        });

        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
