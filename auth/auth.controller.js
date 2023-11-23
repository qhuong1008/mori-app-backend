const accountController = require("../controller/account.controller");
const account = require("../model/account.model");
const authMethod = require("./auth.methods");
const randToken = require("rand-token");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
require("dotenv/config");
const jwtVariable = {
  refreshTokenSize: 16, // Kích thước refresh token mong muốn
};

// tạo account
exports.registerAccount = async (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password;
  const displayName = req.body.displayName;
  const email = req.body.email;

  if (username && email && password && displayName) {
    const user = await account.findOne({
      $or: [{ username }, { email }],
    });
    if (user) res.status(409).json("Username or email has already existed!");
    else {
      const newUser = {
        username: username,
        password: password,
        displayName: displayName,
        email: email,
      };
      const createUser = await accountController.createByUsername(newUser); // trả về true/false và lưu xuống db
      if (!createUser) {
        return res.status(400).json({
          message: "There was an error creating the account, please try again.",
        });
      }
      return res.json({
        username,
        message: "Account created successfully",
      });
    }
  } else {
    res.status(400).json("Fill in missing user information");
  }
};

// login
exports.login = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  const user = await accountController.findByUsername(username);
  if (!user) {
    return res.status(401).json("Username does not exist!");
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json("Incorrect password!");
  }

  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const dataForAccessToken = {
    username: user.username,
  };
  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res.status(401).json("Login failed, please try again.");
  }

  let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
  if (!user.refreshToken) {
    // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
    await accountController.updateRefreshToken(user.username, refreshToken);
  } else {
    // Nếu user này đã có refresh token thì lấy refresh token đó từ database
    refreshToken = user.refreshToken;
  }

  return res.json({
    msg: "Login success",
    accessToken,
    refreshToken,
    user,
  });
};

// Phát sinh một access token khi cái cũ hết hạn
exports.refreshToken = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send("Không tìm thấy access token.");
  }

  // Lấy refresh token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send("Không tìm thấy refresh token.");
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
    return res.status(400).send("Access token không hợp lệ.");
  }

  const username = decoded.payload.username; // Lấy username từ payload

  const user = await accountController.findByUsername(username);
  if (!user) {
    return res.status(401).send("User không tồn tại.");
  }

  if (refreshTokenFromBody !== user.refreshToken) {
    return res.status(400).send("Refresh token không hợp lệ.");
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
      .send("Tạo access token không thành công, vui lòng thử lại.");
  }
  return res.json({
    accessToken,
  });
};
