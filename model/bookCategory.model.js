const { Schema, model } = require("mongoose");

const bookCategory = new Schema({
  name: { type: String },
  tags: { type: String },
});

module.exports = model("bookCategory", bookCategory);
