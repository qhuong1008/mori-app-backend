const BookCategory = require("../model/bookCategory.model");

exports.createBookCategory = async (req, res) => {
  const isExist = await BookCategory.findOne(req.body);
  if (!isExist) {
    var categoryDetail = new BookCategory(req.body);
    await categoryDetail
      .save()
      .then(() => {
        res.json("Book category added successfully!");
      })
      .catch((err) => console.log(err));
  } else {
    res.json("BookCategory already exist!");
  }
};

exports.findAll = async (req, res) => {
  const bookCategories = await BookCategory.find({});
  res.json({ bookCategories: bookCategories, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const bookCategory = await BookCategory.findOne(req.body);
  res.json({ bookCategory: bookCategory, statusCode: 200 });
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
