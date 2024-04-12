const express = require("express");
const router = express.Router();
var cors = require("cors");

const orderController = require("../controller/order.controller");

router.post("/", cors(), orderController.order);

module.exports = router;
