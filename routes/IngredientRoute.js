const express = require('express');
const router = express.Router();
const controller = require('../controllers/IngredientController');

router.get('/name', controller.getIngredientByName);

module.exports = router;