const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const book = require("../controller/book.controller");

router.get("/get-book", cors(), book.findAll);

router.post("/add-book", cors(), book.create);

module.exports = router;
