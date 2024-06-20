const mongoose = require("mongoose");

const userVoucherSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountVoucher",
  },
  expiresDate: {
    type: Date,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedDate: {
    type: Date,
  },
});

module.exports = mongoose.model("UserVoucher", userVoucherSchema);
