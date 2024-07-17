const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const readHistory = require("../controller/readHistory.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.get("/get-readHistory", readHistory.findAll);
router.get("/get-readHistory/:id", isAuth, readHistory.findAllWithUser);
router.get("/get-readHistory/:book_id/:user_id", readHistory.findOne);
router.post("/add-readHistory", readHistory.createOrUpdateReadHistory);

module.exports = router;
