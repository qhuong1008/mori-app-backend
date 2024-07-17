const express = require("express");
const router = express.Router();
const cors = require("cors");
const followController = require("../controller/follow.controller");

// Routes for follow
router.get("/", cors(), followController.getAllFollows);
router.get("/follower/:id", cors(), followController.getFollowers);
router.get("/following/:id", cors(), followController.getFollowings);
router.post("/follow-user", cors(), followController.followUser);
router.post("/unfollow-user", cors(), followController.unfollowUser);
router.post("/is-following", cors(), followController.isFollowing);

module.exports = router;
