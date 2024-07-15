const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const account = new Schema({
  username: { type: String },
  password: {
    type: String,
    minlength: 6,
  },
  email: { type: String },
  displayName: { type: String, minlength: 3, maxlength: 30 },
  phoneNumber: { type: String },
  avatar: {
    type: String,
    default: "avt.jpg",
  },
  role: {
    type: Number,
    default: 0,
  },
  is_member: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  is_verify_email: { type: Boolean, default: false },
  refreshToken: { type: String},
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  recommendations: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

// Middleware để băm mật khẩu trước khi lưu vào cơ sở dữ liệu
account.pre("save", async function (next) {
  try {
    // Nếu mật khẩu đã được thay đổi hoặc là tài khoản mới
    if (this.isModified("password") || this.isNew) {
      if (this.password && this.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
      } else {
        // Bỏ qua nếu mật khẩu rỗng
        return next();
      }
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = model("Account", account);
