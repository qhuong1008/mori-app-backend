const { Schema, model } = require("mongoose");

const bookCategory = new Schema({
  name: { type: String, unique:true, require: true},
  tag: { type: String, unique:true, require: true },
  is_active: { type: Boolean },
});

module.exports = model("BookCategory", bookCategory);
