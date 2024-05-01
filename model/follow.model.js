const { Schema, model, mongoose } = require("mongoose");
const follow = new Schema({
  // người thực hiện hành động follow
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  // người được follow
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Follow", follow);
