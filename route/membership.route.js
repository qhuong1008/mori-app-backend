const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const membership = require("../controller/membership.controller");

router.get("/get-membership", cors(), membership.findAll);

router.post("/add-membership", cors(), membership.create);

module.exports = router;
