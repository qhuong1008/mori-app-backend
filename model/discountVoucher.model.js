const mongoose = require("mongoose");

const discountVoucherSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  discount: {
    type: Number,
  },
  booksBought: {
    type: Number,
  },
  description: {
    type: String,
  },
  expiresIn: {
    type: Number,
  },
});

module.exports = mongoose.model("DiscountVoucher", discountVoucherSchema);
