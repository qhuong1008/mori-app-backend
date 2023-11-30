const { Schema, model } = require("mongoose");
const tag = new Schema({
  name: { type: String },
  description: { type: String },
  is_active: { type: Boolean, default: true },
});

module.exports = model("Tag", tag);
