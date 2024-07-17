const express = require("express");
const router = express.Router();
const cors = require("cors");
const userVoucherController = require("../controller/userVoucher.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.post("/", userVoucherController.createUserVoucher);
router.get("/:id", isAuth, userVoucherController.getAllUserVouchersById);
router.put("/:id", userVoucherController.updateUserVoucherUsedStatus);

module.exports = router;
