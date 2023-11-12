const { Schema, model } = require("mongoose");

const bookRanking = new Schema({
  book_id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  date: { type: Date, default: Date.now },
  totalRead: { type: Number, default: 0 },
});

module.exports = model("bookRanking", bookRanking);
