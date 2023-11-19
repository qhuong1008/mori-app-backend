const { Schema, model } = require("mongoose");

const review = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "Account" },
  book_id: { type: Schema.Types.ObjectId, ref: "Book" },
  rating: { type: Number, min: 1, max: 5 },
  content: { type: String , default: null},
  postedDate: { type: Date , default: new Date()},
  liked: { type: Number, default: 0},
  disliked: { type: Number, default: 0 },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

module.exports = model("Review", review);
