const mongoose = require("mongoose");
const notificationModel = require("../model/notification.model");
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
  try {
    var notification = new notificationModel(req.body);
    await notification
      .save()
      .then(() => {
        res.json({ message: "Tạo thông báo mới thành công!" });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    return res.status(400).json({ err: err });
  }
};

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const notification = await notificationModel
      .find({ account: new ObjectId(userId) })
      .populate("post")
      .populate("performedBy");
    res.json({ data: notification, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const notification = await notificationModel
      .find()
      .populate("post")
      .populate("performedBy");
    res.json({ data: notification, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notitoUpdate = await notificationModel.findById(id);
    if (!notitoUpdate) {
      return res.json({ message: "Thông báo không tìm thấy." });
    }
    notitoUpdate.isRead = true;
    await notitoUpdate
      .save()
      .then(() => {
        res.json({ message: "Thông báo đã được đánh dấu đã đọc." });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("err", err);
    return res.status(400).json({ err: err });
  }
};
