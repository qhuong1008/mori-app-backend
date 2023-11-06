const { Schema, model } = require("mongoose");

const readHistory = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  time: { type: String },
});

module.exports = model("ReadHistory", readHistory);
