const { Schema, model } = require("mongoose");

const readHistory = new Schema({
  book: { type: Object },
  user: { type: Object },
  time: { type: String },
});

module.exports = model("readHistory", readHistory);
