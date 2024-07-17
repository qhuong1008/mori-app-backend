const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const transaction = require("../controller/transaction.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.get("/get-usertrans", isAuth, transaction.getUserTrans);
router.get(
  "/get-transaction/:book_id/:user_id",
  isAuth,
  transaction.checkUserBuyBook
);
router.post("/add-transaction", transaction.create);
router.get("/get-transaction", transaction.getAllTransactions);
router.get("/get-by-date-range", transaction.listTransactionsByDateRange);

module.exports = router;
