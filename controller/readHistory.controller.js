const readHistory = require("../model/readHistory.model");

exports.create = async (req, res) => {
  var readHistoryDetail = new book(req.body);
  await readHistoryDetail
    .save()
    .then(() => {
      res.json("readHistory added successfully!");
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const readHistorys = await readHistory.find({});
  res.json({ readHistorys: readHistorys, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
