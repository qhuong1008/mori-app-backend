const { default: mongoose } = require("mongoose");

const readingGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  // Những cuốn sách đã đọc
  booksRead: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      default: [],
    },
  ],
  pagesRead: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  goalType: {
    type: String,
    enum: ["pages", "books"],
  },
  goalAmount: {
    type: Number,
  },
  timeFrame: {
    type: String,
    enum: ["day", "week", "month", "year"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    onUpdate: Date.now,
  },
});

module.exports = mongoose.model("readingGoal", readingGoalSchema);
