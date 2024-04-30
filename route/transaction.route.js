const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const transaction = require("../controller/transaction.controller");

router.get("/get-transaction/:id", cors(), transaction.getUserTrans);
router.get("/get-transactions", cors(), transaction.getAllTransactions);
router.post("/add-transaction", cors(), transaction.create);

module.exports = router;
