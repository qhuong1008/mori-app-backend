const { Schema, model } = require("mongoose");

const account = new Schema({
  email: { type: String },
  displayName: { type: String },
  phoneNumber: { type: String },
  avatar: { type: String },
  role: { type: Number },
  is_member: { type: Boolean },
  is_blocked: { type: Boolean },
});

module.exports = model("account", account);
