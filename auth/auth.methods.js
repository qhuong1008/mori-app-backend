const jwt = require("jsonwebtoken");

// phát sinh ra một refresh token nếu muốn nó có thời gian tồn tại như access token
exports.generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    const token = await jwt.sign(
      { payload },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
    // console.log("Token generated:", token);
    return token;
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

// access token được đính kèm trong phần headers sau đó ta sẽ verify token đó
exports.verifyToken = async (token, secretKey) => {
  try {
    const verifyResult = await jwt.verify(token, secretKey);
    console.log("verifyResult", verifyResult);
    return verifyResult;
  } catch (error) {
    console.log(`Error in verify access token:  + ${error}`);
    return null;
  }
};

// để decode access token cũ đã hết hạn
exports.decodeToken = async (token, secretKey) => {
  try {
    return await jwt.verify(token, secretKey, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};
