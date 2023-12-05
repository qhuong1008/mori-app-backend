
const express = require("express");
const router = express.Router();
var cors = require("cors");

const chapterController = require("../controller/chapter.controller");

router.post("/add-chapter", cors(), chapterController.addChapter);
router.get("/get-chapter", cors(), chapterController.getAllChapters);
router.get("/get-chapter/:id", cors(), chapterController.getChapterById);
router.patch("/:id", cors(), chapterController.updateChapter);
router.delete("/:id", cors(), chapterController.deleteChapter);

module.exports = router;