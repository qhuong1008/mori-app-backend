const accountController = require("../controller/account.controller");
const authMethod = require("./auth.methods");
const jwt = require("jsonwebtoken");

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
  const origin = req.headers["origin"] || req.headers["referer"];
  const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];
  const plainToken = process.env.ALLOW_ORIGIN_TOKEN;
  const hashedToken = req.headers["authorization"].split(" ")[1];
  const decodedToken = atob(hashedToken);
  // const decodedToken = jwt.verify(
  //   hashedToken,
  //   process.env.JWT_SECRET_ALLOW_ORIGIN
  // );

  console.log("hashedToken", hashedToken);
  console.log("decodedToken", decodedToken);
  if (hashedToken) {
    if (!allowedOrigins.includes(origin)) {
      console.log("Forbidden origin ", origin);
      return res.status(403).json({ err: "Forbidden origin" });
    }
    if (plainToken !== decodedToken) {
      return res.status(403).json({ err: "Forbidden origin" });
    } else {
      next();
    }
  } else {
    return res.status(403).json({ err: "Forbidden origin" });
  }
};
