const { Schema, model } = require("mongoose");

const bookCategory = new Schema({
  name: { type: String },
  tags: { type: String },
  is_active: { type: Boolean },
});

module.exports = model("bookCategory", bookCategory);
