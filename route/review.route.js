const express = require("express");
const router = express.Router();
const cors = require("cors");
const reviewController = require("../controller/review.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

// Routes for reviews
router.post("/rate", reviewController.ratingBook);
router.post("/comment", isAuth, reviewController.reviewBook);
router.get("/getReviews/:id", reviewController.getReviewsByBook);
router.get("/getRatings/:id", reviewController.getRatingsByBook);
router.put("/:id", isAuth, reviewController.updateReview);
router.delete("/:id", isAuth, reviewController.deleteReview);

module.exports = router;
