const { Schema, model } = require("mongoose");

const rating = new Schema({
  book: { type: Schema.ObjectId },
  user: { type: String },
  value: { type: Schema.Number },
});

module.exports = model("Rating", rating);
