import Note from "../models/NoteModel.js";



export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const existingNote = await Note.findOne({ title });

    if (existingNote) {
      return res.status(400).json({
        message: "A note with this title already exists",
      });
    }

    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({createdAt:-1});
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note", error });
  } 
};

export const updateNote = async (req, res) => {
    try {   
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: "Failed to update note", error });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);    
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete note", error });
    }   
};

