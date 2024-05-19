const {
  create,
  findByUserId,
  findAll,
  markAsRead,
} = require("../controller/notification.controller");
const notificationModel = require("../model/notification.model");
const postModel = require("../model/post.model");

jest.mock("../model/notification.model");
jest.mock("../model/post.model");

describe("Notification Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new notification and return success message if the post is found and not created by the same user", async () => {
      const mockPost = {
        _id: "postId123",
        account: { _id: "accountId456" },
      };

      req.body = {
        post: "postId123",
        performedBy: "differentUserId",
      };

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockPost);
      postModel.findById.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      notificationModel.prototype.save = jest.fn().mockResolvedValueOnce({});

      await create(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(req.body.post);
      expect(notificationModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tạo thông báo mới thành công!",
      });
    });

    it("should not create notification if the post is created by the same user", async () => {
      const mockPost = {
        _id: "postId123",
        account: { _id: "accountId456" },
      };

      req.body = {
        post: "postId123",
        performedBy: "accountId456",
      };

      const mockExec = jest.fn().mockResolvedValueOnce(mockPost);
      const mockPopulate = jest.fn().mockReturnThis();
      postModel.findById.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await create(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(req.body.post);
      expect(notificationModel.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Không thể tự tạo thông báo cho bài viết của chính mình.",
      });
    });

    it("should return an error if the post is not found", async () => {
      req.body = {
        post: "postId123",
        performedBy: "accountId456",
      };

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      postModel.findById.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await create(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(req.body.post);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: "Post not found." });
    });

    it("should handle errors and return a 400 status code", async () => {
      const errorMessage = "Test error";
      req.body = {
        post: "postId123",
        performedBy: "accountId456",
      };

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      postModel.findById.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: errorMessage });
    });
  });

  describe("findByUserId", () => {
    it("should return notifications for a specific user", async () => {
      const mockNotifications = [
        {
          _id: "notificationId1",
          account: "userId123",
          post: "postId123",
          performedBy: "userId456",
        },
        {
          _id: "notificationId2",
          account: "userId123",
          post: "postId456",
          performedBy: "userId789",
        },
      ];

      req.params.userId = "6622a4ddfecb762cfd3fc33c";

      const mockExec = jest.fn().mockResolvedValueOnce(mockNotifications);
      const mockPopulate = jest.fn().mockReturnThis();
      notificationModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findByUserId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        data: mockNotifications,
        statusCode: 200,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.userId = "userId123";

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      notificationModel.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await findByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });

  describe("findAll", () => {
    // it("should return all notifications with populated fields", async () => {
    //   const mockNotifications = [
    //     { _id: "notificationId1", post: "postId123", performedBy: "userId456" },
    //     { _id: "notificationId2", post: "postId456", performedBy: "userId789" },
    //   ];

    //   const mockExec = jest.fn().mockResolvedValue(mockNotifications);
    //   const mockPopulate = jest.fn().mockReturnThis();
    //   notificationModel.find.mockReturnValue({
    //     populate: mockPopulate,
    //     exec: mockExec,
    //   });

    //   await findAll(req, res);

    //   expect(notificationModel.find).toHaveBeenCalledWith();
    //   expect(res.json).toHaveBeenCalledWith({
    //     data: mockNotifications,
    //     statusCode: 200,
    //   });
    // });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";

      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      notificationModel.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });

  describe("markAsRead", () => {
    it("should mark a notification as read and return success message", async () => {
      const mockNotification = {
        _id: "notificationId123",
        isRead: false,
        save: jest.fn().mockResolvedValueOnce({}),
      };

      req.params.id = "notificationId123";

      notificationModel.findById.mockResolvedValueOnce(mockNotification);

      await markAsRead(req, res);

      expect(notificationModel.findById).toHaveBeenCalledWith(req.params.id);
      expect(mockNotification.isRead).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Thông báo đã được đánh dấu đã đọc.",
      });
    });

    it("should return a message if notification is not found", async () => {
      req.params.id = "notificationId123";

      notificationModel.findById.mockResolvedValueOnce(null);

      await markAsRead(req, res);

      expect(notificationModel.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({
        message: "Thông báo không tìm thấy.",
      });
    });

    it("should handle errors and return a 400 status code", async () => {
      const errorMessage = "Test error";
      req.params.id = "notificationId123";

      notificationModel.findById.mockRejectedValueOnce(new Error(errorMessage));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: new Error(errorMessage) });
    });
  });
});
