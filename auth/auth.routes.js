const express = require("express");
const router = express.Router();
var cors = require("cors");

const authController = require("./auth.controller");
const fogotController = require("./forgotPassword.controller");

router.post("/register", cors(), authController.registerAccount);
router.post("/login", cors(), authController.login);
router.post("/refresh-token", cors(), authController.refreshToken);

// verify email
router.get("/verify", cors(), authController.verifyEmail);

// forgot password
router.post("/forgot-password", cors(), fogotController.forgotPassword);
router.post("/check-token", cors(), fogotController.checkToken);
router.post("/reset-password", cors(), fogotController.resetPassword);

module.exports = router;
