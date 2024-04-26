const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const transaction = require("../controller/transaction.controller");

router.get("/get-usertrans", cors(), transaction.getUserTrans);

router.post("/add-transaction", cors(), transaction.create);

module.exports = router;
