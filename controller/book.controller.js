const book = require("../model/bookSchema");

exports.create = async (req, res) => {
  var bookDetail = new book(req.body);
  await bookDetail
    .save()
    .then(() => {
      res.json("Book added successfully!");
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const books = await book.find({});
  res.json({ books: books, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
