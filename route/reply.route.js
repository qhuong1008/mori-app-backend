const express = require("express");
const router = express.Router();
const cors = require("cors");
const replyController = require("../controller/reply.controller");

router.post("/replies", replyController.createReply);
router.get("/replies", replyController.getAllRepliesForComment);
router.put("/replies/:id", replyController.updateReply);
router.delete("/replies/:id", replyController.deleteReply);

module.exports = router;
