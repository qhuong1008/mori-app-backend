const membership = require("../model/membership.model");

exports.create = async (req, res) => {
  const isExist = await membership.findOne({ user: req.body.user });
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
exports.findById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await membership.findOne({
      user: userId,
    });
    res.json({ membership: result, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};
exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
