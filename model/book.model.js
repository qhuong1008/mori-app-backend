const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String, index: "text", unique: true },
  author: { type: String, index: "text" },
  image: { type: String },
  audio: { type: String },
  intro: { type: String },
  pdf: { type: String },
  totalPages: { type: Number },
  totalRead: { type: Number },
  totalSaved: { type: Number },
  totalHearted: { type: Number },
  rating: { type: Number },
  tags: { type: [String], index: "text" },
  liked: { type: Number },
  access_level: { type: Number },
  is_active: { type: Boolean },
});

module.exports = model("book", book);
