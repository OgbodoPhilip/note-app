import Note from "../models/NoteModel.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
    });

    res.status(201).json(note);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A note with this title already exists",
      });
    }

    console.error("Create Note Error:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).lean();

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get Notes Error:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Get Note Error:", error);

    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        content: content?.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A note with this title already exists",
      });
    }

    console.error("Update Note Error:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete Note Error:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};
