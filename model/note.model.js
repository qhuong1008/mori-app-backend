const { Schema, model } = require("mongoose");

const note = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  title: { type: String },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  page: { type: Number },
  content: { type: String },
});

module.exports = model("Note", note);
