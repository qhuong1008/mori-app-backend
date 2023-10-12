const { Schema, model } = require("mongoose");

const account = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  avatar: { type: String },
  role: { type: Number },
  is_member: { type: Boolean },
  is_locked: { type: Boolean },
});

module.exports = model("account", account);
