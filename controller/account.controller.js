const userVoucherController = require("../controller/userVoucher.controller");
const notiController = require("../controller/notification.controller");
const discountVoucherController = require("../controller/discountVoucher.controller");
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
exports.checkCreateByUsername = async (user) => {
  try {
    const username = user.username;
    const email = user.email;
    const isExist = await Account.findOne({ $or: [{ username }, { email }] });
    if (!isExist) {
      var accountDetail = new Account(user);
      await accountDetail.save().then(async (resp) => {
        // create new voucher for newbies
        const targetVouchers =
          await discountVoucherController.findVouchersForNewUsers();
        const accountId = resp._id;
        console.log("targetVouchers", targetVouchers);
        targetVouchers.forEach(async (t) => {
          const userVoucher =
            await userVoucherController.createUserVoucherAction(
              accountId,
              t._id
            );
          // gửi thông báo người dùng đã được nhận voucher giảm giá
          await notiController.createNewVoucherReceivedNotification(
            accountId,
            userVoucher._id
          );
        });
      });

      return 1;
    } else if (isExist) {
      console.log("isExist", isExist);
      return 2;
    }
  } catch (err) {
    return err;
  }
};
exports.createByUsername = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    console.log("createByUsername", username, email);
    const isExist = await Account.findOne({ $or: [{ username }, { email }] });
    console.log("isExist", isExist);
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
exports.isGoogleAccountExist = async (email) => {
  const isExist = await Account.findOne({ email: email });
  return isExist;
};
exports.getGoogleAccount = async (email) => {
  const account = await Account.findOne({ email: email });
  return account;
};

// không sử dụng nữa
exports.createNewAccount = async (newAccount) => {
  try {
    var accountDetail = new Account({
      email: newAccount.email,
      displayName: newAccount.displayName,
      username: newAccount.username,
      avatar: newAccount.avatar,
      is_member: false,
      is_blocked: false,
      is_active: true,
      is_verify_email: false,
    });
    await accountDetail.save();
    return accountDetail;
  } catch (err) {
    return err;
  }
};
// tạo tài khoản thường - không sử dụng nữa
exports.createManualAccount = async (req, res) => {
  console.log("createManualAccount");
  try {
    const isExistEmail = await Account.findOne({ email: req.body.email });
    const isExistUsername = await Account.findOne({ email: req.body.username });
    // password hashing
    const passwordInput = req.body.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordInput, saltRounds);

    if (!isExistEmail && !isExistUsername) {
      var accountDetail = new Account({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        displayName: req.body.displayName,
        avatar: "http://ebook.workon.space/api/accountimg/avt.jpg",
        is_member: false,
        is_blocked: false,
        is_active: true,
        is_verify_email: false,
      });
      await accountDetail.save();
      return res.status(200).json({ data: accountDetail });
    } else {
      return res
        .status(200)
        .json({ err: "Tài khoản với username hoặc email đã tồn tại!" });
    }
  } catch (err) {
    console.log("login error: ", err);
    return res.status(400).json({ err: err });
  }
};

exports.manualLogin = async (req, res) => {};
exports.findAll = async (req, res) => {
  const accounts = await Account.find({});
  res.json({ accounts: accounts, statusCode: 200 });
};
exports.findByEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const account = await Account.find({ email: email });
    res.status(200).json({
      data: {
        _id: account[0]._id,
        email: account[0].email,
        displayName: account[0].displayName,
        avatar: account[0].avatar,
      },
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).json({ err: err });
  }
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
    if (!user || !user.password) {
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
