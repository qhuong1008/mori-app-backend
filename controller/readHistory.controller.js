const readHistory = require("../model/readHistory.model");

exports.create = async (req, res) => {
  const isExist = await readHistory.findOne(req.body);
  if(!isExist) {
    var readHistoryDetail = new readHistory(req.body);
    await readHistoryDetail
      .save()
      .then(() => {
        res.json("readHistory added successfully!");
      })
      .catch((err) => console.log(err));
  }
};

exports.findAll = async (req, res) => {
  const readHistorys = await readHistory.find({});
  res.json({ readHistorys: readHistorys, statusCode: 200 });
};
exports.findAllWithUser = async (req, res) => {
  const result = await readHistory.find({
    user: req.params.id,
  });
  res.json({ readHistory: result, statusCode: 200 });
};
exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
