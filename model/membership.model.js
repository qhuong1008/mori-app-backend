const { Schema, model } = require("mongoose");

const membership = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  start_date: { type: Date },
  outdated_on: { type: Date },
});

module.exports = model("Membership", membership);
