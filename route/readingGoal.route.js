const express = require("express");
const router = express.Router();
const cors = require("cors");
const readingGoalController = require("../controller/readingGoal.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

// Routes for reviews
router.post("/", isAuth, readingGoalController.createReadingGoal);
router.put("/:goalId", readingGoalController.editReadingGoal);
router.post("/:goalId/reset", readingGoalController.resetReadingProgress);
router.get("/:userId", isAuth, readingGoalController.findByUserId);
router.put("/read-pages/:userId", readingGoalController.updateReadPages);
router.put(
  "/read-books/:userId/:bookId",
  readingGoalController.updateReadBooks
);
router.get("/id/:id", readingGoalController.findById);
router.delete("/:id", isAuth, readingGoalController.deleteReadingGoal);

module.exports = router;
