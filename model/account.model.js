const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const account = new Schema({
  username: {
    type: String,
    unique: true,
    validate: {
      validator: function (value) {
        // Kiểm tra xem username có đúng định dạng hay không (ví dụ: không có ký tự đặc biệt)
        return /^[a-zA-Z0-9]+$/.test(value);
      },
      message: "Username is not valid.",
    },
  },
  password: {
    type: String,
    minlength: 6,
    validate: {
      validator: function (value) {
        // Sử dụng validator để kiểm tra yêu cầu về mật khẩu mạnh
        return validator.isStrongPassword(value);
      },
      message:
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Sử dụng một biểu thức chính quy để kiểm tra định dạng email
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  displayName: { type: String, required: true, minlength: 3, maxlength: 30 },
  phoneNumber: {
    type: String,
    // validate: {
    //   validator: function (value) {
    //     // Sử dụng validator để kiểm tra số điện thoại ở Việt Nam
    //     return validator.isMobilePhone(value, "vi-VN");
    //   },
    //   message: "Invalid phone number.",
    // },
  },
  avatar: {
    type: String,
    default: "https://moristorage123.blob.core.windows.net/bookimg/avt.jpg",
  },
  role: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger, // Kiểm tra xem giá trị có phải là số nguyên không
      message: "{VALUE} is not an integer value!",
    },
  },
  is_member: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  is_verify_email: { type: Boolean, default: false },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
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
