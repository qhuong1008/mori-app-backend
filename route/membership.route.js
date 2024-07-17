const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const membership = require("../controller/membership.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.get("/get-membership", membership.findAll);
router.get("/get-membership/:id", isAuth, membership.findById);

router.post("/add-membership", isAuth, membership.create);

module.exports = router;
