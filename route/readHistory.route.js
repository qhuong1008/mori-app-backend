const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const readHistory = require("../controller/readHistory.controller");

router.get("/get-readHistory", cors(), readHistory.findAll);

router.post("/add-readHistory", cors(), readHistory.create);

module.exports = router;
