const express = require("express");
const router = express.Router();
const cors = require("cors");
const notificationController = require("../controller/notification.controller");

// Routes for notification
router.get("/:userId", cors(), notificationController.findByUserId);
router.get("/", cors(), notificationController.findAll);
router.post("/", cors(), notificationController.create);
router.post("/mark-as-read/:id", cors(), notificationController.markAsRead);
router.post(
  "/mark-all-as-read/:id",
  cors(),
  notificationController.markAllAsRead
);
router.post(
  "/notify-membership-outdated/:accountId",
  cors(),
  notificationController.createMembershipWillBeOutdatedNotification
);

module.exports = router;
