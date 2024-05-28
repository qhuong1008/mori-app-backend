const {
  getAllFollows,
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser,
  isFollowing,
} = require("../controller/follow.controller");
const Follow = require("../model/follow.model");

jest.mock("../model/follow.model");

describe("Follow Controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllFollows", () => {
    it("should get all follows", async () => {
      const req = {};
      const follows = [
        { _id: "followId1", user: "userId1" },
        { _id: "followId2", user: "userId2" },
      ];
      Follow.find.mockReturnValue(follows);

      await getAllFollows(req, res);

      expect(Follow.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: follows });
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
      };

      const errorMessage = "An error occurred";
      Follow.find.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getAllFollows(req, res)).rejects.toThrow(errorMessage);
    });
  });

  describe("getFollowers", () => {
    it("should get followers by user ID", async () => {
      const req = {
        params: { id: "userId123" },
      };
      const followers = [
        { _id: "followerId1", follower: { name: "User1" } },
        { _id: "followerId2", follower: { name: "User2" } },
      ];
      const mockExec = jest.fn().mockResolvedValue(followers);
      const mockPopulate = jest.fn().mockReturnThis();

      Follow.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await getFollowers(req, res);

      expect(Follow.find).toHaveBeenCalledWith({ following: "userId123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: followers.map((follower) => follower.follower),
      });
    });

    //////////////////////////////////
    it("should handle errors", async () => {
      const req = {
        params: { id: "userId123" },
      };

      const errorMessage = "Test error";
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      Follow.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await expect(getFollowers(req, res)).rejects.toThrow(errorMessage);
    });
    ////////////////////////////////////
  });

  describe("getFollowings", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should get followings by user ID", async () => {
      const req = {
        params: { id: "userId123" },
      };
      const followings = [
        { _id: "followingId1", following: { name: "User1" } },
        { _id: "followingId2", following: { name: "User2" } },
      ];

      const mockExec = jest.fn().mockResolvedValue(followings);
      const mockPopulate = jest.fn().mockReturnThis();

      Follow.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });
      //   Follow.find.mockResolvedValueOnce(followings);

      await getFollowings(req, res);

      expect(Follow.find).toHaveBeenCalledWith({ follower: "userId123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: followings.map((following) => following.following),
      });
    });


    ///////////////////////////////////////////
      it("should handle errors", async () => {
        const req = {
          params: { id: "userId123" },
        };
  
        const errorMessage = "Test error";
        const mockPopulate = jest.fn().mockReturnThis();
        const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
        Follow.find.mockReturnValueOnce({ populate: mockPopulate });
        mockPopulate.mockReturnValueOnce({ exec: mockExec });

        await expect(getFollowings(req, res)).rejects.toThrow(errorMessage);
      });
      ///////////////////////////////////
  });

  describe("followUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should follow user successfully", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId456" },
      };
      const newFollow = {
        _id: "followId123",
        follower: "followerId123",
        following: "followingId456",
      };

      Follow.findOne.mockResolvedValueOnce(null);
      Follow.prototype.save.mockResolvedValueOnce(newFollow);

      await followUser(req, res);

      expect(Follow.findOne).toHaveBeenCalledWith({
        follower: "followerId123",
        following: "followingId456",
      });
      expect(Follow.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Follow người dùng thành công!",
        data: newFollow,
      });
    });

    it("should handle self follow attempt", async () => {
      const req = {
        body: { follower: "userId123", following: "userId123" },
      };
      await followUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Không thể follow chính mình!",
      });
    });

    it("should handle existing follow", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId456" },
      };
      Follow.findOne.mockResolvedValueOnce({});

      await followUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bạn đã follow người dùng này!",
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId456" },
      };
      const errorMessage = "An error occurred";
      Follow.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await followUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: new Error(errorMessage) });
    });
  });

  describe("unfollowUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should unfollow a user successfully", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId123" },
      };
      const deletedFollow = { deletedCount: 1 };

      Follow.deleteOne.mockResolvedValueOnce(deletedFollow);

      await unfollowUser(req, res);

      expect(Follow.deleteOne).toHaveBeenCalledWith({
        follower: "followerId123",
        following: "followingId123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unfollow người dùng thành công!",
        data: deletedFollow,
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId123" },
      };

      const errorMessage = new Error("An error occurred");
      Follow.deleteOne.mockRejectedValueOnce(errorMessage);

      await unfollowUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        err: errorMessage,
      });
    });
  });

  describe("isFollowing", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return true if following", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId123" },
      };
      const currentFollowing = [{ _id: "followId123" }];
      Follow.find.mockResolvedValueOnce(currentFollowing);

      await isFollowing(req, res);

      expect(Follow.find).toHaveBeenCalledWith({
        follower: "followerId123",
        following: "followingId123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: true });
    });

    it("should return false if not following", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId123" },
      };
      const currentFollowing = [];
      Follow.find.mockResolvedValueOnce(currentFollowing);

      await isFollowing(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: false });
    });

    it("should handle errors", async () => {
      const req = {
        body: { follower: "followerId123", following: "followingId123" },
      };
      const errorMessage = new Error("An error occurred");
      Follow.find.mockRejectedValueOnce(errorMessage);

      await isFollowing(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        err: errorMessage,
      });
    });
  });
});
