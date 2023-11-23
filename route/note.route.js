const express = require("express");
const router = express.Router();
const cors = require("cors");
const noteController = require("../controller/note.controller");

// Enable CORS
// router.use(cors());

// Routes for notes
router.post("/notes", cors(), noteController.createNote);
router.get("/notes", cors(), noteController.getAllNotesByUser);
router.get("/notes", cors(), noteController.getAllNotesForBook);
router.put("/notes/:id", cors(), noteController.updateNote);
router.delete("/notes/:id", cors(), noteController.deleteNote);

module.exports = router;
