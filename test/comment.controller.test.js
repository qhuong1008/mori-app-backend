const {
  createComment,
  createReplyComment,
  getAllCommentsByUserId,
  likeComment,
} = require("../controller/comment.controller");
const Comment = require("../model/comment.model");

jest.mock("../model/comment.model");

describe("Comment Controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    it("should create a new comment", async () => {
      const req = {
        body: {
          content: "This is a test comment",
          account: "accountId123",
          post: "postId123",
        },
      };
      const savedComment = {
        _id: "commentId123",
        content: "This is a test comment",
        account: "accountId123",
        post: "postId123",
      };
      Comment.prototype.save.mockResolvedValueOnce(savedComment);

      await createComment(req, res);

      expect(Comment).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Thêm bình luận thành công!",
        statusCode: 200,
        data: savedComment,
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: {},
      };
      const errorMessage = "An error occurred";
      Comment.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      });

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: errorMessage,
      });
    });
  });

  describe("createReplyComment", () => {
    it("should create a new reply comment", async () => {
      const req = {
        body: {
          content: "This is a test reply comment",
          account: "accountId123",
          post: "postId123",
          parent_comment: "parentCommentId123",
        },
      };
      const savedComment = {
        _id: "replyCommentId123",
        content: "This is a test reply comment",
        account: "accountId123",
        post: "postId123",
        parent_comment: "parentCommentId123",
      };
      Comment.prototype.save.mockResolvedValueOnce(savedComment);
      Comment.findById.mockResolvedValueOnce({
        replies: [],
        save: jest.fn(),
      });

      await createReplyComment(req, res);

      expect(Comment).toHaveBeenCalledWith(req.body);
      expect(Comment.findById).toHaveBeenCalledWith("parentCommentId123");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Trả lời bình luận thành công!",
        data: savedComment,
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: {},
      };
      const errorMessage = "An error occurred";
      Comment.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      });

      await createReplyComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getAllCommentsByUserId", () => {
    it("should get all comments by user ID", async () => {
      const req = {
        body: {
          account: "userId123",
          post: "postId123",
        },
      };
      const comments = [
        {
          _id: "commentId1",
          content: "Comment 1",
          account: "userId123",
          post: "postId123",
        },
        {
          _id: "commentId2",
          content: "Comment 2",
          account: "userId123",
          post: "postId123",
        },
      ];
      const mockExec = jest.fn().mockResolvedValue(comments);
      const mockPopulate = jest.fn().mockReturnThis();

      Comment.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await getAllCommentsByUserId(req, res);

      expect(Comment.find).toHaveBeenCalledWith({
        account: "userId123",
        post: "postId123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: comments });
    });

    it("should handle errors", async () => {
      const req = {
        body: {},
      };
      const errorMessage = "An error occurred";
      Comment.find.mockReturnValue(new Error(errorMessage));

      await getAllCommentsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Something wrong occured!",
      });
    });
  });

  describe("likeComment", () => {
    it("should add a like to the comment if the user has not liked it before", async () => {
      const req = {
        params: {
          id: "commentId123",
        },
        body: {
          accountId: "accountId123",
        },
      };
      const comment = {
        _id: "commentId123",
        likes: [],
        save: jest.fn(),
      };

      Comment.findById.mockResolvedValueOnce(comment);

      await likeComment(req, res);

      expect(Comment.findById).toHaveBeenCalledWith("commentId123");
      expect(comment.likes).toContain("accountId123");
      expect(comment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Hearted!" });
    });

    it("should remove a like from the comment if the user has already liked it", async () => {
      const req = {
        params: {
          id: "commentId123",
        },
        body: {
          accountId: "accountId123",
        },
      };
      const comment = {
        _id: "commentId123",
        likes: ["accountId123"],
        save: jest.fn(),
      };

      Comment.findById.mockResolvedValueOnce(comment);

      await likeComment(req, res);

      expect(Comment.findById).toHaveBeenCalledWith("commentId123");
      expect(comment.likes).not.toContain("accountId123");
      expect(comment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Unhearted!" });
    });

    it("should handle errors", async () => {
      const req = {
        params: {
          id: "commentId123",
        },
        body: {
          accountId: "accountId123",
        },
      };
      const errorMessage = "An error occurred";
      Comment.findById.mockRejectedValueOnce(new Error(errorMessage));

      await likeComment(req, res);

      expect(Comment.findById).toHaveBeenCalledWith("commentId123");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
