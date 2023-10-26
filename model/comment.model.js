const { Schema, model } = require("mongoose");

const comment = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  content: { type: String },
  postedDate: { type: Date },
  liked: { type: Number },
  disliked: { type: Number },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
});

module.exports = model("comment", comment);
