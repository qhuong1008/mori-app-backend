const express = require("express");
const router = express.Router();
const cors = require("cors");
const replyController = require("../controller/reply.controller");

// Enable CORS
// router.use(cors());

// Routes for replies
router.post("/replies", cors(), replyController.createReply);
router.get("/replies", cors(), replyController.getAllRepliesForComment);
router.put("/replies/:id", cors(), replyController.updateReply);
router.delete("/replies/:id", cors(), replyController.deleteReply);

module.exports = router;
