const followModel = require("../model/follow.model");

exports.getAllFollows = async (req, res) => {
  try {
    const follows = await followModel.find();

    return res.status(200).json({ data: follows });
  } catch (error) {
    console.error(`Error retrieving followers: ${error}`);
    throw error;
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const followers = await followModel
      .find({ following: userId })
      .populate({
        path: "follower",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken -password",
      }).exec();
    const data = followers.map((follower) => follower.follower);
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(`Error retrieving followers: ${error}`);
    throw error;
  }
};

exports.getFollowings = async (req, res) => {
  try {
    const userId = req.params.id;
    const followings = await followModel
      .find({ follower: userId })
      .populate({
        path: "following",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken -password",
      })
      .exec();
    const data = followings.map((follower) => follower.following);
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(`Error retrieving followings: ${error}`);
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

    // Check if you follow yourself
    const selfFollow = followerId == followingId;
    if (selfFollow === true) {
      return res.status(400).json({ message: "Không thể follow chính mình!" });
    }
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

exports.isFollowing = async (req, res) => {
  try {
    const followerId = req.body.follower;
    const followingId = req.body.following;
    const currentFollowing = await followModel.find({
      follower: followerId,
      following: followingId,
    });

    if (currentFollowing.length != 0) {
      return res.status(200).json({
        message: true,
      });
    } else {
      return res.status(200).json({
        message: false,
      });
    }
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(400).json({ err: error });
  }
};
