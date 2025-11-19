const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const recipeRoutes = require('./routes/RecipeRoute.js');

const PORT = 3000 || process.env.PORT

app.use(cors({ origin: 'http://localhost:5173' }));

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(logger('dev'));

app.use('/recipes', recipeRoutes);

app.listen(PORT, () => {
    console.log(`The express app is ready on ${PORT}`);
});
