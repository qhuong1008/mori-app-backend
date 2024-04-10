const Account = require("../model/account.model");
const bcrypt = require("bcrypt");

// tìm user bằng username
exports.findByUsername = async (username) => {
  try {
    const data = await Account.findOne({ username: username });
    return data;
  } catch {
    return null;
  }
};

// tạo user khi dùng username, mật khẩu, mail
exports.createByUsername = async (user) => {
  try {
    const username = user.username;
    const email = user.email;
    const isExist = await Account.findOne({ $or: [{ username }, { email }] });
    if (!isExist) {
      var accountDetail = new Account(user);
      await accountDetail.save();
      return 1;
    } else if (isExist) {
      console.log("isExist", isExist);
      return 2;
    }
    return 0;
  } catch (err) {
    return err;
  }
};

// refresh token
// Mỗi tài khoản mình chỉ phát sinh một refresh token,
// nếu nó đã tồn tại (đã được phát sinh ở lần đăng nhập trước) thì không phát sinh lại
exports.updateRefreshToken = async (username, refreshToken) => {
  try {
    await Account.find({ username: username })
      .assign({ refreshToken: refreshToken })
      .write();
    return true;
  } catch {
    return false;
  }
};

// tạo user khi dùng tài khoản gg
exports.create = async (req, res) => {
  try {
    const isExist = await Account.findOne({ email: req.body.email });
    console.log("isExist", isExist);
    if (!isExist) {
      var accountDetail = new Account({
        email: req.body.email,
        displayName: req.body.displayName,
        avatar: req.body.avatar,
        is_member: false,
        is_blocked: false,
        is_active: true,
        is_verify_email: false,
      });
      await accountDetail.save();
      return res.status(200).json({ data: accountDetail });
    } else {
      return res.status(200).json({ data: "User already registered!" });
    }
  } catch (err) {
    console.log("login error: ", err);
    return res.status(400).json({ err: err });
  }
};

exports.findAll = async (req, res) => {
  const accounts = await Account.find({});
  res.json({ accounts: accounts, statusCode: 200 });
};
exports.findById = async (req, res) => {
  const acctId = req.params.id;
  try {
    const acctResult = await Account.findById(acctId);
    res.json({ account: acctResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.findOne = async (req, res) => {
  const result = await Account.findOne(req.body);
  res.json({ account: result, statusCode: 200 });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const updated = req.body.account;
  try {
    Account.findByIdAndUpdate(id, updated, { new: true }).then(
      (updatedAccount) => {
        if (updatedAccount) {
          res.json({ updatedAccount: updatedAccount, updated: updated });
        } else {
          res.json("Account not found!");
        }
      }
    );
  } catch (err) {
    console.log("err:", err);
    res.json({ error: err, statusCode: 500 });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    // Tìm tài khoản bằng tên người dùng
    const user = await Account.findOne({ username });
    if (!user.password) {
      return res
        .status(401)
        .json({ error: "error", message: "Tài khoản không tồn tại" });
    }

    // Kiểm tra xem mật khẩu cũ có khớp không
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "error", message: "Mật khẩu cũ không hợp lệ" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error", message: error.message });
  }
};

exports.delete = (req, res) => {};
