import Note from "../models/NoteModel.js";
import Recipe from "../models/RecipeModel.js";

export const getNotesForRecipe = async (req, res) => {
  try {
    const notes = await Note.find({
      recipe: req.params.recipeId,
      user: req.user.id
    }).populate("user", "username");

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      user: req.user.id,
      recipe: req.params.recipeId,
      text: req.body.text,
    });
    await Recipe.findByIdAndUpdate(req.params.recipeId, { $push: { notes: note._id } });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const editNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, user: req.user.id });
    if (!note) return res.status(403).json({ error: "Not allowed" });

    note.text = req.body.text || note.text;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    await Recipe.findByIdAndUpdate(note.recipe, { $pull: { notes: note._id } });
    await note.deleteOne();

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
