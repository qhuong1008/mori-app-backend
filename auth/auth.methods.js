const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

// phát sinh ra một refresh token nếu muốn nó có thời gian tồn tại như access token
exports.generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

// access token được đính kèm trong phần headers sau đó ta sẽ verify token đó
exports.verifyToken = async (token, secretKey) => {
  try {
    const verifyResult = await verify(token, secretKey);
    console.log("verifyResult", verifyResult);
    return verifyResult;
  } catch (error) {
    console.log(`Error in verify access token:  + ${error}`);
    return null;
  }
};

// để decode access token cũ đã hết hạn
exports.decodeToken = async (token) => {
  try {
    console.log("41", token);
    const decoded = jwt.decode(token, { complete: true });
    console.log("42", decoded);
    if (!decoded) {
      console.error("Invalid token");
    }
    return decoded.payload.payload;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};
