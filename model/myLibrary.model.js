const { Schema, model } = require("mongoose");
const myLibrary = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  status: { type: String },
  currentPage: { type: Number },
  progress: { type: Number },
});

module.exports = model("MyLibrary", myLibrary);
