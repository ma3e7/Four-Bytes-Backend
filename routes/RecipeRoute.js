const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');

router.get('/all', controller.getAllRecipes);
router.get('/by-name', controller.getRecipesByName);
router.get('/by-ingredients', controller.getRecipesByIngredients);
router.get('/bookmarked', controller.getBookmarkedRecipes);
router.put('/edit/:recipe_id', controller.editRecipe);
router.delete('/delete/:recipe_id', controller.deleteRecipe);

module.exports = router;
