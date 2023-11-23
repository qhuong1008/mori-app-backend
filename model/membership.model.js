const { Schema, model, mongoose } = require("mongoose");
const DateOnly = require("mongoose-dateonly")(mongoose);

const today = new Date();
const next365daysDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
const next365daysDateOnly = new DateOnly(next365daysDate);

const membership = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  type: { type: String, ref: "MembershipType" },
  start_date: { type: String },
  outdated_on: { type: String },
});

module.exports = model("Membership", membership);
