const { Schema, model } = require("mongoose");

const account = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  displayName: { type: String },
  phoneNumber: { type: String, default: null },
  avatar: {
    type: String,
    default: "https://moristorage123.blob.core.windows.net/bookimg/avt.jpg",
  },
  role: { type: Number, default: 0 },
  is_member: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
});

module.exports = model("Account", account);
