const membership = require("../model/membership.model");

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  return `${year}-${month + 1}-${day}`;
};
const currentDate = new Date(getCurrentDate());

exports.create = async (req, res) => {
  try {
    // console.log("body create memmbership:", req.body);
    const isExist = await membership.findOne({ user: req.body.user });
    if (isExist && isExist.outdated_on > currentDate) {
      return res.status(400).json({
        error:
          "Đăng kí gói cước thất bại, vui lòng sử dụng hết gói cước đã đăng kí!",
      });
    } else {
      var membershipDetail = new membership(req.body);
      await membershipDetail.save();
      res.json({ message: "membership added successfully!" });
    }
  } catch (error) {
    console.error("Lỗi khi cập đăng ký hội viên", error);
    res.status(500).json({ err: "Server error" });
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
    if (!result) {
      return res
        .status(404)
        .json({ error: "Người dùng chưa đăng ký gói cước này" });
    } else if (result && result.outdated_on < currentDate) {
      return res.status(404).json({ error: "Gói cước người dùng đã hết hạn" });
    }
    return res.status(200).json({ membership: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};
exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
