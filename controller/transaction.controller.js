const transaction = require("../model/transaction.model");

exports.create = async (req, res) => {
  var transactionDetail = new book(req.body);
  await transactionDetail
    .save()
    .then(() => {
      res.json("transaction added successfully!");
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const transactions = await transaction.find({});
  res.json({ transactions: transactions, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
