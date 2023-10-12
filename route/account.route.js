const express = require("express");
const router = express.Router();
var cors = require("cors");
const account = require("../controller/account.controller");

router.get("/get-account", cors(), account.findAll);

router.post("/add-account", cors(), account.create);

module.exports = router;
