const { Schema, model } = require("mongoose");

const orderItem = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: "Order" },
  book_id: { type: Schema.Types.ObjectId, ref: "Book" },
  quantity: { type: Number },
  price: { type: BigInt, default: 0 },
});

module.exports = model("OrderItem", orderItem);
