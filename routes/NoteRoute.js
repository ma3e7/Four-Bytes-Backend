import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotesForRecipe, createNote, editNote, deleteNote } from "../controllers/NoteController.js";

const router = express.Router();
router.use(protect);

router.get("/:recipeId", getNotesForRecipe);
router.post("/:recipeId", createNote);
router.put("/:noteId", editNote);
router.delete("/:noteId", deleteNote);

export default router;
