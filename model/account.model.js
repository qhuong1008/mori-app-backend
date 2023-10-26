const { Schema, model } = require("mongoose");

const account = new Schema({
  email: { type: String, index: "text" },
  displayName: { type: String, index: "text" },
  phoneNumber: { type: String, index: "text" },
  avatar: { type: String },
  role: { type: Number, index: "text" },
  is_member: { type: Boolean },
  is_blocked: { type: Boolean },
});

module.exports = model("account", account);
