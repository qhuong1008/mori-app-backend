const membership = require("../model/membership.model");

exports.create = async (req, res) => {
  var membershipDetail = new book(req.body);
  await membershipDetail
    .save()
    .then(() => {
      res.json("membership added successfully!");
    })
    .catch((err) => console.log(err));
};

exports.findAll = async (req, res) => {
  const memberships = await membership.find({});
  res.json({ memberships: memberships, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
