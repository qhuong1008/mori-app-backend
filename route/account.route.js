const express = require("express");
const router = express.Router();
const cors = require("cors");
const account = require("../controller/account.controller");

const whitelist = [process.env.DOMAIN]; // Thêm domain bạn muốn cho phép truy cập vào whitelist

router.get("/get-account", account.findAll);
router.patch("/:id",  account.update);
router.get("/get-account/:id",  account.findById);
router.post("/add-account",  account.create);
router.post("/find-account",  account.findOne);
router.post("/change-password",  account.changePassword);

// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;
router.get("/profile", isAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
