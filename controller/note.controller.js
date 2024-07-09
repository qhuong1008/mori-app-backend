const Note = require("../model/note.model");

// Hàm tạo mới note
exports.createNote = async (req, res) => {
  try {
    const newNote = new Note(req.body);

    // Lưu note vào cơ sở dữ liệu
    const savedNote = await newNote.save();

    res.status(200).json({ note: savedNote, statusCode: 200 });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "error", message: error.message });
  }
};

// Hàm lấy tất cả note của một quyển sách
exports.getNotesForBookByUser = async (req, res) => {
  try {
    const book = req.params.book_id;
    const user = req.params.user_id;

    const allNotesForBook = await Note.find({ user: user, book: book }).sort({
      _id: -1,
    });

    if (allNotesForBook) {
      res.json({ notes: allNotesForBook, statusCode: 200 });
    } else {
      res.json({
        message: "Không có ghi chú trước đó",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.error("Error getting all notes for book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm cập nhật thông tin của một note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { user, book, content, cfiRange, color } = req.body;
    const noteToUpdate = await Note.findById(noteId);

    if (!noteToUpdate) {
      return res.status(404).json({ message: "Note not found" });
    }
    // Cập nhật thông tin note
    noteToUpdate.user = user;
    noteToUpdate.book = book;
    noteToUpdate.content = content;
    noteToUpdate.cfiRange = cfiRange;
    noteToUpdate.color = color;

    await noteToUpdate.save();
    return res.status(200).json({
      message: "Cập nhật note thành công!",
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
    const noteId = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res
      .status(200)
      .json({ message: "Xóa note thành công", deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
