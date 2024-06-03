const mongoose = require("mongoose");
const notificationModel = require("../model/notification.model");
const postModel = require("../model/post.model");
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
  try {
    const post = await postModel
      .findById(req.body.post)
      .populate("account")
      .exec();

    if (!post) {
      return res.status(400).json({ err: "Post not found." });
    }

    if (post.account._id.toString() !== req.body.performedBy) {
      const notification = new notificationModel(req.body);
      await notification.save();
      return res.status(200).json({ message: "Tạo thông báo mới thành công!" });
    }

    console.log("Không thể tự tạo thông báo cho bài viết của chính mình.");
    return res.status(200).json({
      message: "Không thể tự tạo thông báo cho bài viết của chính mình.",
    });
  } catch (err) {
    console.error("Lỗi:", err);
    return res.status(400).json({ err: err.message });
  }
};

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const notification = await notificationModel
      .find({ account: new ObjectId(userId) })
      .populate("post")
      .populate("performedBy")
      .exec();
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
      .populate("performedBy")
      .exec();
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
// Function to create notification for reaching reading goal
exports.createReadingGoalReachedNotification = async (
  userId,
  goalAmount,
  goalType,
  timeFrame,
  id
) => {
  const message = `Chúc mừng! Bạn đã hoàn thành mục tiêu đọc ${goalAmount} ${
    goalType == "pages" ? "trang " : "quyển "
  }sách trong 1 ${
    timeFrame == "day"
      ? " ngày!"
      : timeFrame == "week"
      ? " tuần!"
      : timeFrame == "month"
      ? " tháng!"
      : " năm!"
  }.`;
  const newNotification = new notificationModel({
    readingGoal: id,
    account: userId,
    message,
    action: "readingGoal",
  });

  try {
    await newNotification.save();
    console.log(
      `Notification created for user ${userId} on reading goal completion.`
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
