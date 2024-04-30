const book = require("../model/book.model");
const imageController = require("../controller/image.controller");

exports.create = async (req, res) => {
  var bookDetail = new book(req.body);
  await bookDetail
    .save()
    .then(() => {
      res.json({ message: "Book added successfully!" });
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const books = await book.find({}).populate("chapters").sort({ _id: -1 });
  res.json({ books: books, statusCode: 200 });
};

exports.findAllEBooks = async (req, res) => {
  const books = await book.find({
    pdf: {
      $type: "string",
    },
  });
  res.json({ books: books, statusCode: 200 });
};
exports.findAllAudioBooks = async (req, res) => {
  const books = await book
    .find({
      chapters: { $exists: true, $ne: [] },
    })
    .populate("chapters");
  res.json({ books: books, statusCode: 200 });
};
exports.findById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookResult = await book.findById(bookId).populate("chapters");
    res.json({ book: bookResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.findBookWithSearchValue = async (req, res) => {
  const result = await book
    .find({ $text: { $search: req.body.searchValue } })
    .populate("chapters");

  res.json({ books: result, statusCode: 200 });
};

exports.findBookByCategory = async (req, res) => {
  const searchValue = req.body.searchValue;
  const result = await book
    .find({
      tags: {
        $in: [searchValue],
      },
    })
    .populate("chapters");

  res.json({ books: result, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const result = await book.findOne(req.body).populate("chapters");
  res.json({ book: result, statusCode: 200 });
};

exports.increaseTotalRead = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookResult = await book.findById(bookId);
    await bookResult.updateOne({
      $inc: {
        totalRead: 1,
      },
    });
    res.json({ message: "Increased by 1!", statusCode: 200 });
  } catch (err) {
    res.json({ error: err, statusCode: 500 });
  }
};

exports.increaseTotalHearted = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookResult = await book.findById(bookId);
    await bookResult.updateOne({
      $inc: {
        totalHearted: 1,
      },
    });
    res.json({ message: "Increased by 1!", statusCode: 200 });
  } catch (err) {
    res.json({ error: err.message, statusCode: 500 });
  }
};

exports.updateTotalSaved = async (req, res) => {
  const bookId = req.params.id;

  try {
    const requestedBook = await book.findById(bookId);
    const isExist = await book.findOne({
      _id: bookId,
      totalSaved: {
        $elemMatch: {
          $eq: req.body.user,
        },
      },
    });
    if (!isExist) {
      await requestedBook.updateOne(
        { $push: { totalSaved: req.body.user } },
        { upsert: true }
      );
      res.json({ message: "Saved into library!", statusCode: 200 });
    } else {
      res.json({
        message: "This user already saved the book into his library.",
        statusCode: 200,
      });
    }
  } catch (err) {
    console.log("err:", err);
    res.json({ error: err, statusCode: 500 });
  }
};
exports.update = async (req, res) => {
  const bookId = req.params.id;
  const updated = req.body.book;
  try {
    book
      .findByIdAndUpdate(bookId, updated, { new: true })
      .then((updatedBook) => {
        if (updatedBook) {
          res.json({ updatedBook: updatedBook, updated: updated });
        } else {
          res.json("Book not found!");
        }
      });
  } catch (err) {
    console.log("err:", err);
    res.json({ error: err, statusCode: 500 });
  }
};

exports.delete = async (req, res) => {
  const bookId = req.params.id;
  try {
    await book.findByIdAndDelete(bookId);
    res.json({ message: "Deleted book successfully!", statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!imageController.isValidImageFormat(req.file)) {
      return res.status(400).json({ error: "Invalid image format!" });
    }
    return res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(400).json({ err: err });
  }
};

exports.uploadEpub = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!imageController.isValidEpubFormat(req.file)) {
      return res.status(400).json({ error: "Invalid epub format!" });
    }
    return res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(400).json({ err: err });
  }
};
