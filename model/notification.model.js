const mongoose = require("mongoose");

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  readingGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReadingGoal",
  },
  message: {
    type: String,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    enum: ["like", "comment", "share", "readingGoal"],
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
});

// Define Notification Model
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
