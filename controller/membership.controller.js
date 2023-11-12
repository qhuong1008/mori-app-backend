const membership = require("../model/membership.model");

exports.create = async (req, res) => {
  const isExist = await membership.findOne(req.body);
  if (!isExist) {
    var membershipDetail = new membership(req.body);
    await membershipDetail
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
  const result = await membership.find({});
  res.json({ memberships: result, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
