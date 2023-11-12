const account = require("../model/account.model");

// tìm user bằng username
exports.findByUsername = async (username) => {
  try {
    const data = await account.findOne({ username: username });
    return data;
  } catch {
    return null;
  }
};

// tạo user khi dùng username, mật khẩu, mail
exports.createByUsername = async (user) => {
  try {
    var accountDetail = new account(user);
    await accountDetail.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// refresh token
// Mỗi tài khoản mình chỉ phát sinh một refresh token, 
// nếu nó đã tồn tại (đã được phát sinh ở lần đăng nhập trước) thì không phát sinh lại
exports.updateRefreshToken = async (username, refreshToken) => {
	try {
		await db
			.get(TABLENAME)
			.find({username: username})
			.assign({refreshToken: refreshToken})
			.write();
		return true;
	} catch {
		return false;
	}
};


// tạo user khi dùng tài khoản gg
exports.create = async (req, res) => {
  const isExist = await account.findOne(req.body);
  if (!isExist) {
    var accountDetail = new account(req.body);
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
  const accounts = await account.find({});
  res.json({ accounts: accounts, statusCode: 200 });
};
exports.findById = async (req, res) => {
  const acctId = req.params.id;
  try {
    const acctResult = await account.findById(acctId);
    res.json({ account: acctResult, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};
exports.findOne = async (req, res) => {
  const result = await account.findOne(req.body);
  res.json({ account: result, statusCode: 200 });
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
