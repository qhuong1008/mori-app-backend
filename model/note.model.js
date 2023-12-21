const { Schema, model } = require("mongoose");

let getTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const day = currentDate.getDate();
  const time = `${day}-${month}-${year}`;
  return time;
};
const note = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Account" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  content: { type: String },
  text: { type: String },
  cfiRange: { type: String },
  color: { type: String },
  time: { type: String, default: getTime()}
})

// const bookmark = new Schema({
//   user: { type: Schema.Types.ObjectId, ref: "Account" },
//   book: { type: Schema.Types.ObjectId, ref: "Book" },
//   page: { type: Number },
// });

module.exports = model("Note", note);
