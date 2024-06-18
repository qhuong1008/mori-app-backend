const { Schema, model } = require("mongoose");

const transaction = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  product: { type: Schema.Types.ObjectId, refPath: "productType" }, // Tham chiếu đến sản phẩm (có thể là sách hoặc gói thành viên)
  productType: String, // Loại sản phẩm: "Book" hoặc "Membership"
  time: { type: Date, default: new Date() },
  status: { type: Number },
  amount: { type: Number },
  userVoucher: { type: Schema.Types.ObjectId, ref: "UserVoucher" }, // Tham chiếu đến voucher giảm giá của người dùng
});

module.exports = model("Transaction", transaction);
