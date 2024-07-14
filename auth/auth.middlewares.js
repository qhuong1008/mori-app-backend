const accountController = require("../controller/account.controller");
const authMethod = require("./auth.methods");
const authController = require("./auth.controller");
const jwt = require("jsonwebtoken");
const { encode, decode } = require("base64-js");

// một middleware trung gian để xác thực có đúng client đã đăng nhập không
exports.isAuth = async (req, res, next) => {
  // Lấy access token từ header
  var authHeader = req.headers["authorization"];
  accessTokenFromHeader = authHeader.split(" ")[1].slice(1, -1);
  console.log("accessTokenFromHeader", accessTokenFromHeader);
  if (!accessTokenFromHeader) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const isTokenExpired = authController.checkTokenExpiration(
    accessTokenFromHeader
  );
  if (isTokenExpired.expired === true) {
    return res
      .status(402)
      .send({ error: "Token expired", reason: isTokenExpired.reason });
  }
  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  console.log("verified", verified);
  if (!verified) {
    return res.status(403).send({ error: "Forbidden" });
  }

  return next();
};

exports.isAuthAdmin = async (req, res, next) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(401).send({ error: "Unauthorized" });
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

  const user = await accountController.findOne(
    (username = verified.payload.username),
    (role = 1)
  );
  req.user = user;

  return next();
};

exports.authenticateAllowedOrigins = (req, res, next) => {
  // Perform origin/referrer validation here
  try {
    const origin = req.headers["origin"] || req.headers["referer"];
    const allowedOrigins = [
      "https://ebook.workon.space/",
      "https://ebook.workon.space",
      "http://103.130.211.150:10047",
      "http://103.130.211.150:10047/",
      "http://localhost:3000",
      "http://localhost:3000/",
      "http://localhost:8080",
      "http://localhost:8080/",
      "http://localhost:3001",
      "http://localhost:3001/",
      "https://sandbox.vnpayment.vn",
      "https://sandbox.vnpayment.vn/",
      "https://mail.google.com",
      "https://mail.google.com/",
      "https://www.google.com/",
      "https://www.google.com",
    ];
    // Define paths that should bypass the origin check
    const bypassPaths = ["/api/auth/verify"];

    // Check if request path is in the bypassPaths list
    const isBypassPath = bypassPaths.some((path) => req.path.startsWith(path));

    if (isBypassPath) {
      next();
    } else {
      const isAllowedOrigin = allowedOrigins.some(
        (allowedOrigin) => origin && origin.startsWith(allowedOrigin)
      );
      if (isAllowedOrigin == true) {
        next();
      } else {
        res.status(403).send("Forbidden: Invalid origin");
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Internal server error");
  }
};
