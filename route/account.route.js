const express = require("express");
const router = express.Router();
const cors = require("cors");
const account = require("../controller/account.controller");

const whitelist = [process.env.DOMAIN]; // Thêm domain bạn muốn cho phép truy cập vào whitelist

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Cho phép truy cập nếu origin nằm trong whitelist hoặc origin không được xác định (ví dụ: yêu cầu từ cùng một máy chủ)
      callback(null, true);
    } else {
      // Từ chối truy cập nếu origin không nằm trong whitelist
      callback(new Error("Not allowed by CORS"));
    }
  },
};

router.get("/get-account", cors(corsOptions), account.findAll);
router.patch("/:id", cors(corsOptions), account.update);
router.get("/get-account/:id", cors(corsOptions), account.findById);
router.post("/add-account", cors(corsOptions), account.create);
router.post("/find-account", cors(corsOptions), account.findOne);
router.post("/change-password", cors(corsOptions), account.changePassword);

// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;
router.get("/profile", [cors(corsOptions), isAuth], async (req, res) => {
  res.send(req.user);
});

module.exports = router;
