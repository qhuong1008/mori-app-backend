const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const hearted = require("../controller/hearted.controller");

router.get("/get-hearted", hearted.findAll);
router.post("/add-hearted", hearted.create);

module.exports = router;
