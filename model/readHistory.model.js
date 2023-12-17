const { Schema, model } = require("mongoose");

let getTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const day = currentDate.getDate();
  const time = `${year}-${month}-${day}`;
  return time;
};

const readHistory = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  time: { type: String, default: getTime() },
  position: { type: String, default: 0 },
});

module.exports = model("ReadHistory", readHistory);
