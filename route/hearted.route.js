const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const hearted = require("../controller/hearted.controller");

router.get("/get-hearted", cors(), hearted.findAll);

router.post("/add-hearted", cors(), hearted.create);

module.exports = router;
