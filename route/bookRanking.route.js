const express = require("express");
const router = express.Router();
var cors = require("cors");
const bookRankingController = require("../controller/bookRanking.controller");

// Routes for book categories
router.post(
  "/increase/:id",
  cors(),
  bookRankingController.increaseTotalReadDaily
);

router.get(
  "/getRanking/:interval",
  cors(),
  bookRankingController.getBookRanking
);
router.get("/get/:id", cors(), bookRankingController.getBookRankingDateOfBook);
router.get(
  "/get/:book_id/:previous",
  cors(),
  bookRankingController.getBookRankingPreviousOfBook
);

module.exports = router;
