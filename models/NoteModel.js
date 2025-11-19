const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipe: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Recipe", 
      required: true 
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

NoteSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Note", NoteSchema);
