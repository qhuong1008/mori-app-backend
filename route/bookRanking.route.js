const express = require("express");
const router = express.Router();
var cors = require("cors");
const bookRankingController = require("../controller/bookRanking.controller");

// Routes for book categories
router.post("/increase/:id", bookRankingController.increaseTotalReadDaily);
router.get("/getRanking/:interval", bookRankingController.getBookRanking);
router.get("/get/:id", bookRankingController.getBookRankingDateOfBook);
router.get(
  "/get/:book_id/:previous",
  bookRankingController.getBookRankingPreviousOfBook
);

module.exports = router;
