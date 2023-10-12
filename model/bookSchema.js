const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String },
  author: { type: String },
  image: { type: String },
  content: { type: String },
  audio: { type: String },
  intro: { type: String },
  totalPages: { type: Number },
  totalRead: { type: Number },
  totalSaved: { type: Number },
  totalHearted: { type: Number },
  tags: { type: [String] },
  liked: { type: Number },
  access_level: { type: Number },
  is_active: { type: Boolean },
});

module.exports = model("book", book);
