const express = require("express");
const router = express.Router();
const cors = require("cors");
const reviewController = require("../controller/review.controller");

// Routes for reviews
router.post("/rate", cors(), reviewController.ratingBook);
router.post("/comment", cors(), reviewController.reviewBook);
router.get("/getReviews", cors(), reviewController.getReviewsByBook);
router.put("/:id", cors(), reviewController.updateReview);
router.delete("/:id", cors(), reviewController.deleteReview);

module.exports = router;
