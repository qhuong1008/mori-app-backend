const accountController = require("../controller/account.controller");
const userVoucherController = require("../controller/userVoucher.controller");
const discountVoucherController = require("../controller/discountVoucher.controller");
const notiController = require("../controller/notification.controller");
const account = require("../model/account.model");
const authMethod = require("./auth.methods");
const randToken = require("rand-token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv/config");
const jwtVariable = {
  refreshTokenSize: 16, // Kích thước refresh token mong muốn
};

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// tạo account
exports.registerAccount = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const displayName = req.body.displayName;
  const email = req.body.email;

  const newUser = {
    username: username,
    password: password,
    displayName: displayName,
    email: email,
  };

  // Create new user and check validation
  const createUser = await accountController.checkCreateByUsername(newUser);

  // Generate JWT token
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET);

  const protocol = req.protocol;
  const host = req.get("host");

  // Return the result
  if (createUser === 1) {
    const verifyEmail = `${process.env.BACKEND_URL}/api/auth/verify?email=${email}&token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực mail tạo tài khoản - Ứng dụng đọc sách online Mori",
      html: `<p>Chúng tôi nhận được yêu cầu tạo tài khoản của bạn.
                <br>Vui lòng nhấp vào liên kết dưới đây để xác thực email tạo tài khoản: <a href="${verifyEmail}"> Xác thực mail</a></br>
                <br>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</br></p>
                <p>Trân trọng,
                <br>Đội ngũ hỗ trợ Mori</br></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({
        username,
        message: "Account created successfully",
        tokenVerify: token,
      });
    } catch (err) {
      console.error("Failed to send verify email:", err);
      return res.status(500).json({ error: "Failed to send verify email" });
    }
  } else if (createUser === 2) {
    return res.json({
      error: "error",
      message: "Username or email has already existed!",
    });
  }
  return res.status(400).json({
    error: "error",
    message: createUser.message,
  });
};

// Xác nhận email
exports.verifyEmail = async (req, res) => {
  const tokenVerify = req.query.token;
  console.log(tokenVerify);
  if (!tokenVerify) {
    // return res.status(400).json({ error: "Missing tokenVerify parameter" });
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=missingtokenverifyparameter`
    );
  }

  try {
    const decodedToken = jwt.verify(tokenVerify, process.env.JWT_SECRET);

    // Cập nhật trạng thái xác thực của tài khoản
    const user = await account.findOneAndUpdate(
      { email: decodedToken.email },
      { $set: { is_verify_email: true } },
      { new: true, useFindAndModify: false }
    );

    if (user) {
      // return res.status(200).json({ message: "Verify email success" });
      res.redirect(`${process.env.FRONTEND_URL}/login?success=true`);
    } else {
      // return res.status(404).json({ error: "User not found or Invalid token" });
      res.redirect(`${process.env.FRONTEND_URL}/login?error=usernotfound`);
    }
  } catch (error) {
    console.error("JWT Verification Error:", error);
    // return res.status(400).json({ error: "Invalid token" });
    res.redirect(`${process.env.FRONTEND_URL}/login?error=invalidtoken`);
  }
};

// login
exports.manualLogin = async (usernameReq, passwordReq) => {
  try {
    const username = usernameReq.toLowerCase();
    const password = passwordReq;
    const user = await accountController.findByUsername(username);
    console.log("password", password);
    if (!user) {
      return { error: "Thông tin đăng nhập không đúng!" };
    } else if (user.is_verify_email == false) {
      return {
        error:
          "Bạn chưa xác thực mail tạo tài khoản, vui lòng kiểm tra mail " +
          user.email,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid == false) {
      return { error: "Mật khẩu bạn nhập chưa chính xác" };
    }

    return {
      user,
    };
  } catch (err) {
    console.log("err for manualCreateAccount: ", err);
    return { error: err };
  }
};

exports.login = async (req, res) => {
  try {
    var user = null;
    // check if is google account
    const isGoogleAccount = req.body.googleAccount;
    // handle for google account
    if (isGoogleAccount) {
      // check if this user exists in db
      const isGoogleAccountExists =
        await accountController.isGoogleAccountExist(
          req.body.googleAccount.email
        );
      if (isGoogleAccountExists) {
        user = await accountController.getGoogleAccount(
          req.body.googleAccount.email
        );
      }
      // if account not exist then create new user
      else {
        console.log("create new user");
        let newAccount = {
          email: req.body.googleAccount.email,
          displayName: req.body.googleAccount.name,
          avatar: req.body.googleAccount.picture,
        };
        console.log("create new account using google account");
        let newAccountResp = await accountController.createNewAccount(
          newAccount
        );
        // create new voucher for newbies
        const targetVoucher =
          await discountVoucherController.findTargetVoucherById(
            "66719559d3a6e7ae7a358d65"
          );
        const accountId = newAccountResp._id;
        const userVoucher = await userVoucherController.createUserVoucherAction(
          accountId,
          targetVoucher._id
        );
        // gửi thông báo người dùng đã được nhận voucher giảm giá
        await notiController.createNewVoucherReceivedNotification(
          accountId,
          userVoucher._id
        );
        console.log("newAccountResp", newAccountResp);
        user = newAccountResp;
        console.log("login google");
      }
    }
    // handle for manual account
    else {
      console.log("handle for manual account");
      // check for input before handle login
      if (req.body.username === "" || req.body.password === "") {
        return res
          .status(200)
          .json({ error: "Vui lòng nhập đủ thông tin đăng nhập!" });
      }
      // handle manual login
      const manualUserResp = await this.manualLogin(
        req.body.username,
        req.body.password
      );
      if (manualUserResp.error) {
        return res.status(400).json({ error: manualUserResp.error });
      } else {
        user = manualUserResp.user;
      }
    }
    // console.log("user", user);
    // check if get user success
    if (user) {
      if (user.is_blocked) {
        return res
          .status(200)
          .json({ error: "Đăng nhập thất bại! Vui lòng thử lại" });
      }
      return res.status(200).json({
        user: {
          avatar: user.avatar,
          displayName: user.displayName,
          email: user.email,
          is_active: user.is_active,
          username: user.username,
          _id: user._id,
          role: user.role,
        },
        message: "Đăng nhập thành công!",
      });
    } else {
      return res
        .status(200)
        .json({ error: "Đăng nhập thất bại! Vui lòng thử lại" });
    }
  } catch (err) {
    console.log("err", err);
    return res
      .status(200)
      .json({ error: "Đăng nhập thất bại! Vui lòng thử lại" });
  }
};

// Phát sinh một access token khi cái cũ hết hạn
exports.refreshToken = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send({ error: "Không tìm thấy access token." });
  }

  // Lấy refresh token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send({ error: "Không tìm thấy refresh token." });
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  // Decode access token đó
  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!decoded) {
    return res.status(400).send({ error: "Access token không hợp lệ." });
  }

  const username = decoded.payload.username; // Lấy username từ payload

  const user = await accountController.findByUsername(username);
  if (!user) {
    return res.status(401).send({ error: "User không tồn tại." });
  }

  if (refreshTokenFromBody !== user.refreshToken) {
    return res.status(400).send({ error: "Refresh token không hợp lệ." });
  }

  // Tạo access token mới
  const dataForAccessToken = {
    username,
  };

  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res
      .status(400)
      .send({ error: "Tạo access token không thành công, vui lòng thử lại." });
  }
  return res.json({
    accessToken,
  });
};
