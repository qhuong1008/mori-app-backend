const Tag = require("../model/tag.model");

// Hàm tạo mới tag
exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Tạo mới tag
    const newTag = new Tag({
      name,
      description,
      is_active: true, // Mặc định tag là active khi tạo mới
    });

    // Lưu tag vào cơ sở dữ liệu
    await newTag.save();

    return res
      .status(201)
      .json({ message: "Tag created successfully", newTag });
  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
    const { name, description, is_active } = req.body;

    // Tìm tag dựa trên tagId
    const tagToUpdate = await Tag.findById(tagId);

    if (!tagToUpdate) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Cập nhật thông tin tag
    tagToUpdate.name = name;
    tagToUpdate.description = description;
    tagToUpdate.is_active = is_active;

    // Lưu tag đã cập nhật vào cơ sở dữ liệu
    await tagToUpdate.save();

    return res
      .status(200)
      .json({ message: "Tag updated successfully", updatedTag: tagToUpdate });
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
