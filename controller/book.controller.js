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
  const result = await book.find({
    $text: { $search: JSON.stringify(req.body.searchValue) },
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

exports.increaseTotalSaved = async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookResult = await book.findById(bookId);
    await bookResult.updateOne({
      $inc: {
        totalSaved: 1,
      },
    });
    res.json({ message: "Increased by 1!", statusCode: 200 });
  } catch (err) {
    res.json({ error: err, statusCode: 500 });
  }
};
exports.update = (req, res) => {};

exports.delete = (req, res) => {};
