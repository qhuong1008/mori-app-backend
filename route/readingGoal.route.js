const express = require("express");
const router = express.Router();
const cors = require("cors");
const readingGoalController = require("../controller/readingGoal.controller");

// Routes for reviews
router.post("/", cors(), readingGoalController.createReadingGoal);
router.put("/:goalId", cors(), readingGoalController.editReadingGoal);
router.post(
  "/:goalId/reset",
  cors(),
  readingGoalController.resetReadingProgress
);
router.get("/:userId", cors(), readingGoalController.findByUserId);
router.put(
  "/read-pages/:userId",
  cors(),
  readingGoalController.updateReadPages
);
router.put(
  "/read-books/:userId/:bookId",
  cors(),
  readingGoalController.updateReadBooks
);
router.get("/id/:id", cors(), readingGoalController.findById);

module.exports = router;
