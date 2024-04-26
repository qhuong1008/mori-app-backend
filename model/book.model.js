const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String },
  author: { type: String },
  image: { type: String },
  audio: { type: String },
  intro: { type: String },
  pdf: { type: String },
  epub: { type: String },
  totalPages: { type: Number, default: 0 },
  totalListened: { type: Number, default: 0 },
  totalRead: { type: Number, default: 0 },
  totalSaved: { type: [Schema.ObjectId], ref: "Account", default: [] },
  totalHearted: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  tags: { type: [String] },
  access_level: { type: Number, default: 0 },
  is_active: { type: Boolean },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter", default: [] }],
  price: { type: Number, default: 0 },
  discountPercent: {type: Number, default: 0 }
});

module.exports = model("Book", book);
