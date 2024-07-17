const express = require("express");
const router = express.Router();
const cors = require("cors");
const notificationController = require("../controller/notification.controller");

// Routes for notes
router.get("/:userId", notificationController.findByUserId);
router.get("/", notificationController.findAll);
router.post("/", notificationController.create);
router.post("/mark-as-read/:id", notificationController.markAsRead);
router.post(
  "/mark-all-as-read/:id",
  notificationController.markAllAsRead
);

module.exports = router;
