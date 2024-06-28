const mongoose = require("mongoose");
const notificationModel = require("../model/notification.model");
const postModel = require("../model/post.model");
const userVoucherModel = require("../model/userVoucher.model");
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

exports.createNewCommentNotification = async (
  postId,
  action,
  currentAccountId,
  commentContent
) => {
  try {
    const post = await postModel.findById(postId).populate("account").exec();

    if (!post) {
      console.log("createNewCommentNotification error: post not found.");
    }

    if (post.account._id.toString() !== currentAccountId.toString()) {
      const notification = new notificationModel({
        account: post.account._id,
        post: postId,
        message: commentContent,
        action: "comment",
        performedBy: currentAccountId,
      });
      await notification.save();
      console.log("Tạo thông báo mới thành công!");
    } else {
      console.log(
        "createNewCommentNotification error: Không thể tự tạo thông báo cho bài viết của chính mình."
      );
    }
  } catch (err) {
    console.error("Lỗi:", err);
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

exports.markAllAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request body

    // Update all notifications for the user by setting isRead to true
    await notificationModel.updateMany(
      { account: id },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Đánh dấu tất cả đã đọc thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đánh dấu đã đọc thất bại" });
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

exports.notifyCommentDisapproval = async (comment) => {
  try {
    const postValue = await postModel.findById(comment.post);
    const notification = {
      account: comment.account,
      action: "comment_disapproved",
      post: comment.post,
      message: `Bình luận của bạn cho bài viết "${postValue.title}" đã bị từ chối`,
    };

    const newNotification = new notificationModel(notification);
    await newNotification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

exports.notifyCommentApproval = async (comment) => {
  try {
    const postValue = await postModel.findById(comment.post);
    const notification = {
      account: comment.account,
      action: "comment_approved",
      post: comment.post,
      message: `Bình luận của bạn cho bài viết "${postValue.title}" đã được duyệt`,
    };

    const newNotification = new notificationModel(notification);
    await newNotification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

exports.createNewVoucherReceivedNotification = async (
  userId,
  userVoucherId
) => {
  try {
    const userVoucher = await userVoucherModel
      .findById(userVoucherId)
      .populate("voucher");

    let message = "";
    if (userVoucher.voucher.code.includes("WELCOME")) {
      message = `Bạn được tặng voucher dành cho người mới ${userVoucher.voucher.description}!`;
    } else {
      message = `Từ việc mua sách lẻ bạn đã nhận được voucher ${userVoucher.voucher.description}!`;
    }
    const newNotification = new notificationModel({
      account: userId,
      message,
      action: "voucher",
    });
    await newNotification.save();
    console.log(`Notification created for user ${userId} on voucher received.`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
