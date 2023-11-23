const { Schema, model } = require("mongoose");
const MyLibrary = require("../model/myLibrary.model");

// khởi tạo cùng với tài khoản
exports.create = async (req, res) => {
  const isExist = await MyLibrary.findOne(req.body);
  if (!isExist) {
    var myLibraryDetail = new MyLibrary(req.body);
    await myLibraryDetail
      .save()
      .then(() => {
        res.json("My library added successfully!");
      })
      .catch((err) => console.log(err));
  } else {
    res.json("My library already exists!");
  }
};

exports.addBookToMyLibrary = async function (req, res) {
  try {
    const existingBook = await MyLibrary.findOne(req.body);
    if (existingBook) {
      return res.json(1);
    } else {
      const newBookInMyLibrary = new MyLibrary(req.body);
      await newBookInMyLibrary.save();
      return res.json(0);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
};

exports.getAllBooksInMyLibrary = async (req, res) => {
  const userId = req.params.id;
  try {
    const libraryResult = await MyLibrary.find({
      user: userId,
    });
    return res.json({ myLibrary: libraryResult });
  } catch (err) {
    console.log(err);
    return res.json({ message: err }).status(500);
  }
};

exports.deleteBookFromMyLibrary = async (req, res) => {
  try {
    const deletedEntry = await MyLibrary.deleteOne(req.body);

    if (deletedEntry) {
      return res.status(200).json(0);
    } else {
      return res.status(404).json(404);
    }
  } catch (error) {
    console.error("Error removing book from MyLibrary:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// hàm này có cần không?
exports.findOne = async (req, res) => {
  const myLibrary = await MyLibrary.findOne(req.body);
  res.json({ myLibrary: myLibrary, statusCode: 200 });
};
