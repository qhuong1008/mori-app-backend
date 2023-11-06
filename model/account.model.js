const { Schema, model } = require("mongoose");

const account = new Schema({
  email: { type: String },
  displayName: { type: String },
  phoneNumber: { type: String },
  avatar: { type: String },
  role: { type: Number },
  is_member: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
});

module.exports = model("Account", account);
