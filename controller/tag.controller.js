const Tag = require("../model/tag.model");

// Hàm tạo mới tag
exports.createTag = async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const isExist = await Tag.findOne({ name: name });
    if (isExist) {
      return res.json({ message: "Tag already exists" });
    }

    // Tạo mới tag
    const newTag = new Tag({ name, description });
    await newTag.save();

    res.json({ message: "Tag added successfully!" });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm lấy tất cả các tags
exports.getAllTags = async (req, res) => {
  try {
    // Lấy tất cả các tags từ cơ sở dữ liệu
    const allTags = await Tag.find();

    return res.status(200).json({ allTags });
  } catch (error) {
    console.error("Error getting all tags:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.findOne = async (req, res) => {
  const result = await Tag.findOne(req.body);
  res.json({ tag: result, statusCode: 200 });
};
exports.findById = async (req, res) => {
  const tagId = req.params.id;
  try {
    const tagResult = await Tag.findById(tagId);
    res.json({ tag: tagResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

// Hàm cập nhật thông tin của một tag
exports.updateTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const { name, description} = req.body;
    if (!name && !description) {
      return res.json({ message: "Name and description are required" });
    }

    // Tìm tag dựa trên tagId
    const tagToUpdate = await Tag.findById(tagId);

    if (!tagToUpdate) {
      return res.json({ message: "Tag not found" });
    }

    // Cập nhật thông tin tag
    tagToUpdate.name = name;
    tagToUpdate.description = description;

    // Lưu tag đã cập nhật vào cơ sở dữ liệu
    await tagToUpdate.save();

    return res.json({
      message: "Tag updated successfully",
      updatedTag: tagToUpdate,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm xóa một tag
exports.deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    // Xóa tag dựa trên tagId
    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res
      .status(200)
      .json({ message: "Tag deleted successfully", deletedTag });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
