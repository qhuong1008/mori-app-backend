const { Schema, model } = require("mongoose");

const chapter = new Schema({
  book_id: { type: Schema.Types.ObjectId, ref: "Book" },
  name: { type: String },
  audio: { type: String },
});

module.exports = model("Chapter", chapter);
