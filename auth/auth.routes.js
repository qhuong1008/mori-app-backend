const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const fogotController = require("./forgotPassword.controller");

router.post("/register", authController.registerAccount);
router.post("/login", authController.login);

// verify email
router.get("/verify-email", authController.verifyEmail);

// forgot password
router.post("/forgot-password", fogotController.forgotPassword);
router.post("/reset-password", fogotController.resetPassword);

module.exports = router;
