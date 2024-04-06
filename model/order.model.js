const { Schema, model } = require("mongoose");

const order = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: "Account" },
  address_id: { type: Schema.Types.ObjectId, ref: "DeliveryAddress" },
  orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem", default: [] }],

  deliveryType: { type: String, enum: ["home", "work"] },
  paymentType: { type: String },
  orderTime: { type: Date },
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
  },
});

module.exports = model("Order", order);
