const { Schema, model } = require("mongoose");

const order = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: "Account" },
  address_id: { type: Schema.Types.ObjectId, ref: "DeliveryAddress" },
  note: { type: String, default: null },
  orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem", default: [] }],

  deliveryType: { type: String, enum: ["home", "work"], default: "home" },
  paymentMethod: {
    type: String,
    enum: ["cod", "creditcard", "momo", "vnpay"],
    default: "cod",
  },
  orderTime: { type: Date , default: new Date()},
  payTime: { type: Date },
  shipTime: { type: Date },
  completedTime: { type: Date },
  total_price: { type: Number },
  status: {
    type: String,
    enum: [
      "pending",
      "toShip",
      "toReceive",
      "completed",
      "cancelled",
      "returnRefund",
    ],
    default: "pending",
  },
});

module.exports = model("Order", order);
