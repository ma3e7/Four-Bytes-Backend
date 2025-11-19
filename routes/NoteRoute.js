const express = require('express');
const router = express.Router();
const noteController = require('../controllers/NoteController');
const verifyToken = require('../middleware/verify-token'); 

router.get('/:recipeId', verifyToken, noteController.getNotesForRecipe);
router.post('/:recipeId', verifyToken, noteController.createNote);
router.put('/:recipeId/:noteId', verifyToken, noteController.editNote);
router.delete('/:recipeId/:noteId', verifyToken, noteController.deleteNote);

module.exports = router;
