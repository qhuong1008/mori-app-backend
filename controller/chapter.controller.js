const Chapter = require("../model/chapter.model");
const Book = require("../model/book.model");

// Hàm thêm chapter với book_id
exports.addChapter = async (req, res) => {
  const { book_id, name, audio } = req.body;

  try {
    // Kiểm tra xem book_id có tồn tại không
    const existingBook = await Book.findById(book_id);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Tạo một chapter mới
    const newChapter = new Chapter({
      book_id,
      name,
      audio,
    });

    // Lưu chapter vào database
    const savedChapter = await newChapter.save();

    // Thêm chapter vào danh sách chapter của book
    existingBook.chapters.push(savedChapter._id);
    await existingBook.save();

    // Trả về thông tin chapter vừa thêm
    res.json({ chapter: savedChapter, statusCode: 200 });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Hàm lấy danh sách tất cả các chapters
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find();
    res.status(200).json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy một chapter cụ thể
exports.getChapterById = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Sửa một chapter
exports.updateChapter = async (req, res) => {
  const { chapterId } = req.params;
  const { name, audio } = req.body;

  try {
    // Kiểm tra xem chapter có tồn tại không
    const existingChapter = await Chapter.findById(chapterId);
    if (!existingChapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Cập nhật thông tin chapter
    existingChapter.name = name || existingChapter.name;
    existingChapter.audio = audio || existingChapter.audio;

    // Lưu lại vào cơ sở dữ liệu
    const updatedChapter = await existingChapter.save();

    res.status(200).json(updatedChapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Xóa một chapter
exports.deleteChapter = async (req, res) => {
  const { chapterId } = req.params;

  try {
    // Kiểm tra xem chapter có tồn tại không
    const existingChapter = await Chapter.findById(chapterId);
    if (!existingChapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Xóa chapter khỏi cơ sở dữ liệu
    await existingChapter.remove();

    res.status(204).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
