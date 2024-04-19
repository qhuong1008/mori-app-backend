const { Schema, model } = require("mongoose");

const post = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
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
  },
  tag: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
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
  image: {
    type: String,
    default: "",
  },
});

module.exports = model("Post", post);
