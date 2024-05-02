const followModel = require("../model/follow.model"); // Assuming you have the Follow model defined

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.query.id;
    const followers = await followModel
      .find({ following: userId })
      .populate("follower");
    const data = followers.map((follower) => follower.follower);
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(`Error retrieving followers: ${error}`);
    throw error;
  }
};

exports.followUser = async (req, res) => {
  try {
    const followerId = req.body.follower;
    const followingId = req.body.following;
    const follow = new followModel({
      follower: followerId,
      following: followingId,
    });

    // Check if the user already follows the specified user
    const existingFollow = await followModel.findOne({
      follower: followerId,
      following: followingId,
    });
    if (existingFollow) {
      return res.status(400).json({ message: "Bạn đã follow người dùng này!" });
    }

    const savedFollow = await follow.save();
    return res.status(200).json({
      message: "Follow người dùng thành công!",
      data: savedFollow,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(400).json({ err: error });
  }
};
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.body.follower;
    const followingId = req.body.following;
    const unfollowed = await followModel.deleteOne({
      follower: followerId,
      following: followingId,
    });

    return res.status(200).json({
      message: "Unfollow người dùng thành công!",
      data: unfollowed,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(400).json({ err: error });
  }
};
