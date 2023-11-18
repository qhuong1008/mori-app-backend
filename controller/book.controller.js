const book = require("../model/book.model");

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
  const books = await book.find({});
  res.json({ books: books, statusCode: 200 });
};

exports.findById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookResult = await book.findById(bookId);
    res.json({ book: bookResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.findBookWithSearchValue = async (req, res) => {
  const result = await book.find({ $text: { $search: req.body.searchValue } });

  res.json({ books: result, statusCode: 200 });
};

exports.findBookByCategory = async (req, res) => {
  const searchValue = req.body.searchValue;
  const result = await book.find({
    tags: {
      $in: [searchValue],
    },
  });

  res.json({ books: result, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const result = await book.findOne(req.body);
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
exports.update = (req, res) => {};

exports.delete = (req, res) => {};
