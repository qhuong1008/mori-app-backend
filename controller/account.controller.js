const account = require("../model/account.model");

exports.create = async (req, res) => {
  const isExist = await account.findOne(req.body);
  if (!isExist) {
    var accountDetail = new account(req.body);
    await accountDetail
      .save()
      .then(() => {
        res.json(0);
      })
      .catch((err) => console.log(err));
  } else {
    res.json(1);
  }
};

exports.findAll = async (req, res) => {
  const accounts = await account.find({});
  res.json({ accounts: accounts, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const result = await account.findOne(req.body);
  res.json({ account: result, statusCode: 200 });
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
