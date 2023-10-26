const MembershipType = require("../model/membershipType.model");

exports.createMembershipType = async (req, res) => {
  const isExist = await MembershipType.findOne(req.body);
  if (!isExist) {
    var membershipTypeDetail = new MembershipType(req.body);
    await membershipTypeDetail
      .save()
      .then(() => {
        res.json("Membership type added successfully!");
      })
      .catch((err) => console.log(err));
  } else {
    res.json("Membership type already exists!");
  }
};

exports.findAll = async (req, res) => {
  const membershipTypes = await MembershipType.find({});
  res.json({ membershipTypes: membershipTypes, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const membershipType = await MembershipType.findOne(req.body);
  res.json({ membershipType: membershipType, statusCode: 200 });
};

exports.update = (req, res) => {
};

exports.delete = (req, res) => {
};