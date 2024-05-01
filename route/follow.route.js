const express = require("express");
const router = express.Router();
const cors = require("cors");
const followController = require("../controller/follow.controller");

// Routes for follow
router.get("/:id", cors(), followController.getFollowers);
router.post("/follow-user", cors(), followController.followUser);
router.post("/unfollow-user", cors(), followController.unfollowUser);

module.exports = router;
