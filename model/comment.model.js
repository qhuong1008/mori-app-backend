const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: [],
    },
  ],
  parent_comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  is_toxic: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
