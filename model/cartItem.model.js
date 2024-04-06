const { Schema, model } = require("mongoose");

const cartItem= new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: "Account" },
  book_id: { type: Schema.Types.ObjectId, ref: "Book" },
  quantity: { type: Number }
});

module.exports = model("CartItem", cartItem);