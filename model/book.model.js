const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String, unique: true },
  author: { type: String },
  image: { type: String },
  audio: { type: String },
  intro: { type: String },
  pdf: { type: String },
  totalPages: { type: Number, default: 0 },
  totalListened: { type: Number, default: 0 },
  totalRead: { type: Number, default: 0 },
  totalSaved: { type: Number },
  totalHearted: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  tags: { type: [String] },
  access_level: { type: Number },
  is_active: { type: Boolean },
});

module.exports = model("Book", book);


list<book> bookList
function get30book_ma_co_totalReadLonNhat(){
  
}