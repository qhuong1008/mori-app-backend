const Note = require("../model/note.model");

// Hàm tạo mới note
exports.createNote = async (req, res) => {
  try {
    const { user, title, book, page, content } = req.body;
    const newNote = new Note({
      user,
      title,
      book,
      page,
      content,
    });

    // Lưu note vào cơ sở dữ liệu
    await newNote.save();

    return res
      .status(201)
      .json({ message: "Note created successfully", newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm lấy tất cả các notes của một người dùng
exports.getAllNotesByUser = async (req, res) => {
  try {
    const userId = res.locals.account._id;

    // Lấy tất cả các notes của người dùng từ cơ sở dữ liệu
    const userNotes = await Note.find({ user: userId });

    return res.status(200).json({ userNotes });
  } catch (error) {
    console.error("Error getting user notes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm lấy tất cả note của một quyển sách
exports.getAllNotesForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = res.locals.account._id;

    const allNotesForBook = await Note.find({ user: userId, book: bookId });

    return res.status(200).json({ allNotesForBook });
  } catch (error) {
    console.error("Error getting all notes for book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm cập nhật thông tin của một note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, page, content } = req.body;

    // Tìm note dựa trên noteId
    const noteToUpdate = await Note.findById(noteId);

    if (!noteToUpdate) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Cập nhật thông tin note
    noteToUpdate.title = title;
    noteToUpdate.page = page;
    noteToUpdate.content = content;

    // Lưu note đã cập nhật vào cơ sở dữ liệu
    await noteToUpdate.save();

    return res.status(200).json({
      message: "Note updated successfully",
      updatedNote: noteToUpdate,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm xóa một note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    // Xóa note dựa trên noteId
    const deletedNote = await Note.findByIdAndRemove(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res
      .status(200)
      .json({ message: "Note deleted successfully", deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
