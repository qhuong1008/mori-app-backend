const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const transaction = require("../controller/transaction.controller");

router.get("/get-usertrans", cors(), transaction.getUserTrans);
router.post("/add-transaction", cors(), transaction.create);
router.get("/get-transaction/:book_id/:user_id", transaction.checkUserBuyBook);
router.get("/get-transaction", cors(), transaction.getAllTransactions);
router.get(
  "/get-by-date-range",
  cors(),
  transaction.listTransactionsByDateRange
);

module.exports = router;
