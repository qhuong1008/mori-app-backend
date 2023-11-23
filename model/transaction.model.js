const { Schema, model } = require("mongoose");

const transaction = new Schema({
  user: { type: Object },
  date: { type: Date },
  status: { type: Number },
  amount: { type: Number },
});

module.exports = model("Transaction", transaction);
