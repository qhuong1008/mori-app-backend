const { Schema, model } = require("mongoose");

const bookCategory = new Schema({
  tag: { type: String, unique:true, require: true },
  name: { type: String, unique:true, require: true},
  is_active: { type: Boolean, default: true },
});

module.exports = model("BookCategory", bookCategory);
