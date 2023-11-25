const Account = require("../model/account.model");

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
      return 2;
    }
    return 0;
  } catch (err) {
    return 0;
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
  const isExist = await Account.findOne(req.body);
  if (!isExist) {
    var accountDetail = new Account(req.body);
    await accountDetail
      .save()
      .then(() => {
        res.json(0);
      })
      .catch((err) => console.log(err));
  } else {
    res.json(1);
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

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
