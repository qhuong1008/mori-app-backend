const { Schema, model } = require("mongoose");

const hearted = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  user: { type: Schema.Types.ObjectId, ref: "Account" },
});

module.exports = model("Hearted", hearted);
