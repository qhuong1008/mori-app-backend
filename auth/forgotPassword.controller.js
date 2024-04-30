const Account = require("../model/account.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  // Find the user by email
  const account = await Account.findOne({
    email: req.body.email,
    username: { $exists: true },
    password: { $exists: true },
  });

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }
  // Generate a password reset token and set its expiration date
  const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  account.passwordResetToken = token;
  var time = 3600000;
  account.passwordResetExpires = Date.now() + time; // 30min
  await account.save();

  const protocol = req.protocol;
  const host = req.get("host");

  // Send the password reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: account.email,
    subject: "Xác Nhận Đặt Lại Mật Khẩu - Ứng Dụng đọc sách online Mori",
    html: `
    <p>Xin chào ${account.displayName},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
      <br>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:<a href="${resetUrl}"> Đặt lại mật khẩu</a></br></p>
      <p>Liên kết này sẽ hết hạn sau ${time / 3600000} giờ.
      <br>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</br></p>
      <p>Trân trọng,
      <br>Đội ngũ hỗ trợ Mori</br></p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({
      message: "Password reset email sent",
      tokenEmail: token,
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return res
      .status(500)
      .json({ error: "Failed to send password reset email" });
  }
};

//////
exports.checkToken = async (req, res) => {
  try {
    // Validate the password reset token
    const tokenEmail = req.body.token;
    const decodedToken = jwt.verify(tokenEmail, process.env.JWT_SECRET);
    console.log(decodedToken);

    // Find the user by their ID and token, and check if the token is still valid
    const account = await Account.findOne({
      _id: decodedToken.id,
      passwordResetToken: tokenEmail,
      passwordResetExpires: { $gt: Date.now() },
    });

  } catch (error) {
    const accountToken = await Account.findOne({
      passwordResetToken: req.body.token,
    });
    if (accountToken) {
      res.status(401).json({ error: "Token expires" });
    } else {
      console.error("Error validating password reset token:", error);
      res.status(401).json({ error: "Token invalid" });
    }
  }
};
exports.resetPassword = async (req, res) => {
  try {
    // Validate the password reset token
    const tokenEmail = req.body.token;
    const decodedToken = jwt.verify(tokenEmail, process.env.JWT_SECRET);
    console.log(decodedToken);

    // Find the user by their ID and token, and check if the token is still valid
    const account = await Account.findOne({
      _id: decodedToken.id,
      passwordResetToken: tokenEmail,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!account) {
      return res
        .status(401)
        .json({ error: "Invalid or expired password reset token" });
    }
    // Validate the new password
    const newPassword = req.body.password;

    if (!newPassword || newPassword.trim() === "") {
      return res.status(400).json({ error: "New password is required" });
    }

    // Update the user's password and remove the reset token and its expiration date
    account.password = req.body.password;
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;

    await account.save();

    // Send a confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: account.email,
      subject: "Đặt lại mật khẩu thành công - Ứng Dụng đọc sách online Mori",
      html: `
    <p>Mật khẩu của bạn đã được đặt lại thành công. Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
  `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Failed to send password reset confirmation email:", err);
      return res
        .status(500)
        .json({ error: "Failed to send password reset confirmation email" });
    }
  } catch (error) {
    const accountToken = await Account.findOne({
      passwordResetToken: req.body.token,
    });
    if (accountToken) {
      res.status(401).json({ error: "Token expires" });
    } else {
      console.error("Error validating password reset token:", error);
      res.status(401).json({ error: "Token invalid" });
    }
  }
};
