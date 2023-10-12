const { Schema, model } = require("mongoose");

const hearted = new Schema({
  book: { type: Object },
  user: { type: Object },
});

module.exports = model("hearted", hearted);
