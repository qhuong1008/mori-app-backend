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

exports.findBookWithSearchValue = async (req, res) => {
  const result = await book.find({
    $text: { $search: JSON.stringify(req.body.searchValue) },
  });
  // const result = req.body.searchValue;

  res.json({ searchResult: result, statusCode: 200 });
};

exports.uploadPDF = async (req, res) => {
  try {
    const {
      name,
      author,
      image,
      intro,
      totalPages,
      totalRead,
      totalSaved,
      totalHearted,
      tags,
      liked,
      access_level,
      is_active,
    } = req.body;

    const bookPDF = new book({
      name,
      author,
      image,
      intro,
      totalPages,
      totalRead,
      totalSaved,
      totalHearted,
      tags,
      liked,
      access_level,
      is_active,
      pdf: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await bookPDF.save();
    res.json({ message: "File uploaded successfully", statusCode: 200 });
  } catch (err) {
    res.json({ message: err, statusCode: 400 });
    console.log("err:", err);
  }
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
