const accountController = require("../controller/account.controller");
const authMethod = require("./auth.methods");
const authController = require("./auth.controller");
const jwt = require("jsonwebtoken");
const { encode, decode } = require("base64-js");
const Account = require("../model/account.model");

// một middleware trung gian để xác thực có đúng client đã đăng nhập không
exports.isAuth = async (req, res, next) => {
  try {
    // Lấy access token từ header
    const authHeader = req.headers["authorization"];
    // console.log("authHeader", authHeader);
    // Kiểm tra xem authHeader có tồn tại và có định dạng "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Access token không tồn tại" });
    }
    // Lấy token từ authHeader
    const accessTokenFromHeader = authHeader
      .split(" ")[1]
      .replace(/^"|"$/g, "");
    if (!accessTokenFromHeader) {
      return res.status(401).json({ error: "Access token không hợp lệ" });
    }
    console.log("accessTokenFromHeader", accessTokenFromHeader);
    // kiểm tra access còn thời gian k
    const isTokenExpired = authController.checkTokenExpiration(
      accessTokenFromHeader
    );
    if (isTokenExpired.expired === true) {
      console.log("access token isTokenExpired");
      // Nếu token hết hạn, gọi refreshToken và sau đó quay lại isAuth
      // await authController.refreshToken(req, res, async () => {
      //   // Sau khi refreshToken, gọi lại isAuth để tiếp tục quá trình xác thực
      //   await exports.isAuth(req, res, next);
      // });
      return authController.refreshToken(req, res, next);
    } else {
      // xác thực access token
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const verified = await authMethod.verifyToken(
        accessTokenFromHeader,
        accessTokenSecret
      );

      console.log("verified", verified);
      if (!verified) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.isAuthAdmin = async (req, res, next) => {
  // Lấy access token từ header
  var authHeader = req.headers["authorization"];
  accessTokenFromHeader = authHeader.split(" ")[1].replace(/^"|"$/g, "");
  if (!accessTokenFromHeader) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!verified) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  console.log("decoded", decoded);

  const user = await Account.findOne({
    _id: decoded._id,
    role: decoded.role,
  });
  if (user.role !== 1) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  return next();
};
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

exports.authenticateAllowedOrigins = (req, res, next) => {
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
        // Set CORS headers to allow credentials
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method === "OPTIONS") {
          return res.sendStatus(200);
        }
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

exports.allowedOrigins = allowedOrigins;
