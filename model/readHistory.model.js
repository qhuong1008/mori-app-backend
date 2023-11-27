const { Schema, model } = require("mongoose");

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const day = currentDate.getDate();

const readHistory = new Schema({
  book: { type: Object, ref: "Book" },
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  time: { type: String, default: `${year}-${month + 1}-${day}` },
});

module.exports = model("ReadHistory", readHistory);
