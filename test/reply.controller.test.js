const Reply = require("../model/reply.model");
const Review = require("../model/review.model");
const {
  createReply,
  getAllRepliesForComment,
  updateReply,
  deleteReply,
} = require("../controller/reply.controller");

jest.mock("../model/reply.model");
jest.mock("../model/review.model");

describe("Reply Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, locals: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    jest.clearAllMocks();
  });

  describe("createReply", () => {
    it("should create a new reply and associate it with the comment", async () => {
      const commentId = "commentId123";
      const content = "This is a new reply.";
      const mockUser = { id: "userId123" };
      req.body = { commentId, content };
      res.locals.account = mockUser;

      const mockReply = { id: "replyId123", content, user: mockUser.id };
      const mockComment = { _id: commentId, replies: [] };

      Reply.prototype.save.mockResolvedValueOnce(mockReply);
      Review.findById.mockResolvedValueOnce({
        replies: [],
        save: jest.fn().mockResolvedValueOnce(mockComment),
      });

      await createReply(req, res);

      expect(Reply).toHaveBeenCalledWith({
        user: mockUser.id,
        commentId,
        content,
      });
      expect(Review.findById).toHaveBeenCalledWith(commentId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReply);
    });

    it("should handle errors and return a 400 status code", async () => {
      const errorMessage = "Test error";
      req.body = { commentId: "commentId123", content: "This is a new reply." };
      Reply.mockRejectedValueOnce(new Error(errorMessage));

      await createReply(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong!" });
    });
  });

  describe("getAllRepliesForComment", () => {
    it("should return all replies for a comment", async () => {
      const commentId = "commentId123";
      req.params.comment_id = commentId;
      const mockReplies = [{ id: "replyId1", content: "Reply 1" }];
      Reply.find.mockResolvedValueOnce(mockReplies);

      await getAllRepliesForComment(req, res);

      expect(Reply.find).toHaveBeenCalledWith({ comment_id: commentId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ repliesForComment: mockReplies });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.comment_id = "commentId123";
      Reply.find.mockRejectedValueOnce(new Error(errorMessage));

      await getAllRepliesForComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateReply", () => {
    it("should update the content of the reply", async () => {
      const replyId = "replyId123";
      const content = "Updated reply content.";
      req.params.replyId = replyId;
      req.body.content = content;
      const mockReply = { _id: replyId, content };
      Reply.findById.mockResolvedValueOnce(mockReply);
      mockReply.save = jest.fn().mockResolvedValueOnce(mockReply);

      await updateReply(req, res);

      expect(Reply.findById).toHaveBeenCalledWith(replyId);
      expect(mockReply.content).toBe(content);
      expect(mockReply.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Reply updated successfully",
        updatedReply: mockReply,
      });
    });

    it("should handle case when reply is not found", async () => {
      req.params.replyId = "replyId123";
      Reply.findById.mockResolvedValueOnce(null);

      await updateReply(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Reply not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.replyId = "replyId123";
      Reply.findById.mockRejectedValueOnce(new Error(errorMessage));

      await updateReply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteReply", () => {
    Reply.findByIdAndRemove = jest.fn();
    it("should delete the reply", async () => {
      const replyId = "replyId123";
      req.params.replyId = replyId;
      const mockReply = { _id: replyId };

      Reply.findByIdAndRemove.mockResolvedValueOnce(mockReply);

      await deleteReply(req, res);

      expect(Reply.findByIdAndRemove).toHaveBeenCalledWith(replyId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Reply deleted successfully",
        deletedReply: mockReply,
      });
    });

    it("should handle case when reply is not found", async () => {
      req.params.replyId = "replyId123";
      Reply.findByIdAndRemove.mockResolvedValueOnce(null);

      await deleteReply(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Reply not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.replyId = "replyId123";
      Reply.findByIdAndRemove.mockRejectedValueOnce(new Error(errorMessage));

      await deleteReply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
