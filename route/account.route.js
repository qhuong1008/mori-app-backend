const express = require("express");
const router = express.Router();
var cors = require("cors");
const account = require("../controller/account.controller");

router.get("/get-account", cors(), account.findAll);
router.get("/get-account/:id", cors(), account.findById);
router.post("/add-account", cors(), account.create);

router.post("/find-account", cors(), account.findOne);

module.exports = router;
