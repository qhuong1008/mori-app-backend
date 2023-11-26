const express = require("express");
const router = express.Router();
var cors = require("cors");
const account = require("../controller/account.controller");

router.get("/get-account", cors(), account.findAll);
router.patch("/:id", cors(), account.update);
router.get("/get-account/:id", cors(), account.findById);
router.post("/add-account", cors(), account.create);
router.post("/find-account", cors(), account.findOne);

// route cho các api cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;
router.get("/profile", isAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
