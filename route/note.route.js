const express = require("express");
const router = express.Router();
const cors = require("cors");
const noteController = require("../controller/note.controller");

// Routes for notes
router.post("/add-note", cors(), noteController.createNote);
router.get("/get-note/:book_id/:user_id", cors(), noteController.getNotesForBookByUser);
router.put("/:id", cors(), noteController.updateNote);
router.delete("/:id", cors(), noteController.deleteNote);

module.exports = router;
