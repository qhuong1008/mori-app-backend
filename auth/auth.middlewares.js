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

function customDecode(encodedStr) {
  let decodedString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let i = 0;
  while (i < encodedStr.length) {
    const encodedChar1 = characters.indexOf(encodedStr.charAt(i++));
    const encodedChar2 = characters.indexOf(encodedStr.charAt(i++));
    const encodedChar3 = characters.indexOf(encodedStr.charAt(i++));
    const encodedChar4 = characters.indexOf(encodedStr.charAt(i++));

    const triplet =
      (encodedChar1 << 18) |
      (encodedChar2 << 12) |
      (encodedChar3 << 6) |
      encodedChar4;

    const char1 = (triplet >> 16) & 255;
    const char2 = (triplet >> 8) & 255;
    const char3 = triplet & 255;

    if (encodedChar3 === 64) {
      decodedString += String.fromCharCode(char1);
    } else if (encodedChar4 === 64) {
      decodedString += String.fromCharCode(char1, char2);
    } else {
      decodedString += String.fromCharCode(char1, char2, char3);
    }
  }

  return decodedString;
}
