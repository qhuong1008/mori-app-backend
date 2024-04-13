const accountController = require("../controller/account.controller");
const authMethod = require("./auth.methods");
const jwt = require("jsonwebtoken");
const { encode, decode } = require("base64-js");

// một middleware trung gian để xác thực có đúng client đã đăng nhập không
exports.isAuth = async (req, res, next) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(401).send({ error: "Không tìm thấy access token!" });
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!verified) {
    return res
      .status(401)
      .send({ error: "Bạn không có quyền truy cập vào tính năng này!" });
  }

  const user = await accountController.findByUsername(
    verified.payload.username
  );
  req.user = user;

  return next();
};

exports.authenticateAllowedOrigins = (req, res, next) => {
  // Perform origin/referrer validation here
  try {
    const origin = req.headers["origin"] || req.headers["referer"];
    console.log("origin", origin);
    const allowedOrigins = [
      "https://ebook.workon.space/",
      "http://103.130.211.150:10047",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:8888/",
      "http://localhost:3001/",
      "https://sandbox.vnpayment.vn/",
    ];

    const isAllowedOrigin = allowedOrigins.some(
      (allowedOrigin) => origin && origin.startsWith(allowedOrigin)
    );
    if (isAllowedOrigin == true) {
      next();
    }
  } catch (err) {
    console.log("err", err);
  }
};
