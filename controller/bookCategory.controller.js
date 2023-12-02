const BookCategory = require("../model/bookCategory.model");

exports.createBookCategory = async (req, res) => {
  const { tag, name } = req.body;
  try {
    const isExist = await BookCategory.findOne({ tag: tag });
    if (isExist) {
      return res.json({ message: "BookCategory already exist!" });
    }
    const categoryDetail = new BookCategory({ tag, name });
    await categoryDetail.save();
    res.json({ message: "Book category added successfully!" });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    // Lấy tất cả các tags từ cơ sở dữ liệu
    const bookCategories = await BookCategory.find();
    return res.status(200).json({ bookCategories });
  } catch (error) {
    console.error("Error getting all tags:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findById = async (req, res) => {
  const bookCategoryId = req.params.id;
  try {
    const categoryResult = await BookCategory.findById(bookCategoryId);
    res.json({ bookCategory: categoryResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const bookCategoryId = req.params.id;
    const { name, tag } = req.body;
    if (!name && !tag) {
      return res.json({ message: "Name and tag are required" });
    }
    const bookCategoryToUpdate = await BookCategory.findById(bookCategoryId);

    if (!bookCategoryToUpdate) {
      return res.json({ message: "BookCategory not found" });
    }

    // Cập nhật thông tin tag
    bookCategoryToUpdate.name = name;
    bookCategoryToUpdate.tag = tag;

    // Lưu tag đã cập nhật vào cơ sở dữ liệu
    await bookCategoryToUpdate.save();

    return res.json({
      message: "BookCategory updated successfully",
      updatedBookCategory: bookCategoryToUpdate,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const bookCategoryId = req.params.id;

    const deletedBookC = await BookCategory.findByIdAndDelete(bookCategoryId);

    if (!deletedBookC) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res
      .status(200)
      .json({ message: "Tag deleted successfully", deleteBookCategory: deletedBookC });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
