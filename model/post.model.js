const { Schema, model } = require("mongoose");

const post = new Schema({
  title: {
    type: String,
    required: true,
  },
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
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: [],
    },
  ],
  shares: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: [],
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
});

module.exports = model("Post", post);
