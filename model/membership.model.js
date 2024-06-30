const { Schema, model } = require("mongoose");

const membership = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  type: { type: String, ref: "MembershipType" },
  start_date: { type: String },
  outdated_on: { type: String },
});

module.exports = model("Membership", membership);
