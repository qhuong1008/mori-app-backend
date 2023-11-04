const { Schema, model } = require("mongoose");
const tag = new Schema({
  name: { type: String },
  description: { type: String },
});

module.exports = model("tag", tag);
