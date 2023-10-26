const { Schema, model } = require("mongoose");

const membership = new Schema({
  user: { type: Object, index: "text" },
  start_date: { type: Date },
  outdated_on: { type: Date },
});

module.exports = model("membership", membership);
