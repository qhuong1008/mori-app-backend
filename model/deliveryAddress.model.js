const { Schema, model } = require("mongoose");

const deliveryAddress = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: "Account" },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  address_type: { type: String },
  addressDefault: { type: Boolean },
});

module.exports = model("DeliveryAddress", deliveryAddress);
