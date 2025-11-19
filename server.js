const express = require('express');
const app = express();
app.use(express.json());

const recipeRoutes = require('./routes/RecipeRoute.js');
app.use('/recipes', recipeRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
