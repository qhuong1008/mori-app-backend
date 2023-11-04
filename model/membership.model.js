const { Schema, model } = require("mongoose");

const membership = new Schema({
  user: { type: Object, index: "text" },
  start_date: { type: Date },
  outdated_on: { type: Date },
  is_active: { type: Boolean },
});

module.exports = model("membership", membership);
