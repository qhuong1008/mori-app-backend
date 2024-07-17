const express = require("express");
const router = express.Router();
const cors = require("cors");
const noteController = require("../controller/note.controller");

// Routes for notes
router.post("/add-note", noteController.createNote);
router.get(
  "/get-note/:book_id/:user_id",
  noteController.getNotesForBookByUser
);
router.put("/:noteId", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
