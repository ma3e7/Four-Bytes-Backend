// --- MOCK DATA --- //
const mockIngredients = [
    { _id: "ing1", name: "Chicken" },
    { _id: "ing2", name: "Salt" },
    { _id: "ing3", name: "Onion" },
    { _id: "ing4", name: "Tomato" },
    { _id: "ing5", name: "Garlic" }
];

const mockRecipes = [
    {
        _id: "rec1",
        name: "Chicken Soup",
        ingredients: ["ing1", "ing2", "ing3"],
        bookmarked: true
    },
    {
        _id: "rec2",
        name: "Tomato Pasta",
        ingredients: ["ing4", "ing5", "ing2"],
        bookmarked: false
    },
    {
        _id: "rec3",
        name: "Garlic Chicken",
        ingredients: ["ing1", "ing5", "ing2"],
        bookmarked: true
    },
    {
        _id: "rec4",
        name: "Onion Omelette",
        ingredients: ["ing3", "ing2"],
        bookmarked: false
    }
];

const populateIngredients = (recipe) => {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map(id =>
            mockIngredients.find(ing => ing._id === id)
        )
    };
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = mockRecipes.map(populateIngredients);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipesByName = async (req, res) => {
    try {
        const { name } = req.query;
        const recipes = mockRecipes
            .filter(r => r.name.toLowerCase().includes(name.toLowerCase()))
            .map(populateIngredients);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipesByIngredients = async (req, res) => {
    try {
        const { ingredients } = req.query;
        if (!ingredients) {
            return res.status(400).json({ message: "Ingredients required" });
        }

        const ingredientList = ingredients.split(",");

        const recipes = mockRecipes
            .filter(recipe =>
                ingredientList.every(i => recipe.ingredients.includes(i))
            )
            .map(populateIngredients);

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookmarkedRecipes = async (req, res) => {
    try {
        const recipes = mockRecipes
            .filter(r => r.bookmarked)
            .map(populateIngredients);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editRecipe = async (req, res) => {
    try {
        const { recipe_id } = req.params;
        const recipe = mockRecipes.find(r => r._id === recipe_id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        Object.assign(recipe, req.body);
        res.json(populateIngredients(recipe));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const index = mockRecipes.findIndex(r => r._id === req.params.recipe_id);
        if (index === -1) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        mockRecipes.splice(index, 1);
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
