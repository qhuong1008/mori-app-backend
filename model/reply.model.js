const { Schema, model } = require("mongoose");

const reply = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  comment_id: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String },
  postedDate: { type: Date },
  liked: { type: Number },
  disliked: { type: Number },
});

module.exports = model("reply", reply);
