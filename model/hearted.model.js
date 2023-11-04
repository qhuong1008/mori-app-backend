const { Schema, model } = require("mongoose");

const hearted = new Schema({
  book: { type: Object },
  user: { type: Object },
  is_active: { type: Boolean },
});

module.exports = model("hearted", hearted);
