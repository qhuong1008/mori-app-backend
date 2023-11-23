const { Schema, model } = require("mongoose");
const membershipType = new Schema({
  name: String,
  description: String,
  duration: Number,
  price: Number,
});

module.exports = model("MembershipType", membershipType);
