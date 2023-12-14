const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const readHistory = require("../controller/readHistory.controller");

router.get("/get-readHistory", cors(), readHistory.findAll);
router.get("/get-readHistory/:id", cors(), readHistory.findAllWithUser);
router.get("/get-readHistory/:book_id/:user_id", cors(), readHistory.findOne);

router.post("/add-readHistory", cors(), readHistory.createOrUpdateReadHistory);

module.exports = router;
