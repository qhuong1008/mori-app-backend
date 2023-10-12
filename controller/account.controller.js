const account = require("../model/account.model");

exports.create = async (req, res) => {
  var accountDetail = new book(req.body);
  await accountDetail
    .save()
    .then(() => {
      res.json("Account added successfully!");
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const accounts = await account.find({});
  res.json({ accounts: accounts, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
