const express = require("express");
const router = express.Router();
var cors = require("cors");

const chapterController = require("../controller/chapter.controller");

router.post("/add-chapter", chapterController.addChapter);
router.get("/get-chapter", chapterController.getAllChapters);
router.get("/get-chapter/:id", chapterController.getChapterById);
router.get(
  "/get-chapter/book/:bookId",
  chapterController.getAllChaptersByBookId
);
router.patch("/:id", chapterController.updateChapter);
router.delete("/:chapterId", chapterController.deleteChapter);

module.exports = router;
