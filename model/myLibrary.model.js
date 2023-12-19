const { Schema, model } = require("mongoose");
const myLibrary = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  status: { type: String, default: "Reading" },
  currentPage: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

module.exports = model("MyLibrary", myLibrary);
