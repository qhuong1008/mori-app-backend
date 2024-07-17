const express = require("express");
const router = express.Router();
const cors = require("cors");
const followController = require("../controller/follow.controller");

// Routes for follow
router.get("/", followController.getAllFollows);
router.get("/follower/:id", followController.getFollowers);
router.get("/following/:id", followController.getFollowings);
router.post("/follow-user", followController.followUser);
router.post("/unfollow-user", followController.unfollowUser);
router.post("/is-following", followController.isFollowing);

module.exports = router;
