const Note = require("../models/NoteModel");

exports.getNotesForRecipe = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
      recipe: req.params.recipeId,
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      user: req.user.id,
      recipe: req.params.recipeId,
      text: req.body.text,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.editNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.user.id,
    });

    if (!note) {
      return res.status(403).json({ error: "Not allowed" });
    }

    note.text = req.body.text || note.text;

    await note.save();
    res.json(note);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
