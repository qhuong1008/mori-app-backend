const {
  createComment,
  createReplyComment,
  getAllCommentsByUserId,
  likeComment,
  
} = require("../controller/comment.controller");
const Comment = require("../model/comment.model");
const axios = require("axios");

jest.mock("../model/comment.model");
jest.mock("axios");
jest.mock("../types", () => ({
  NLP_URL: "http://mocked-nlp-url",
}));

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
    const req = {
      body: {
        content: "This is a test comment",
        account: "accountId123",
        post: "postId123",
      },
    };
    const newComment = {
      content: "This is a test comment",
      account: "accountId123",
      post: "postId123",
    };
    it("should create a comment successfully with a positive sentiment", async () => {
      // Comment.prototype.save.mockResolvedValueOnce(savedComment);
      const mockSave = jest.fn().mockResolvedValueOnce(newComment);
      Comment.prototype.save = mockSave;
      axios.post.mockResolvedValueOnce({ data: { sentiment: "POSITIVE" } });

      await createComment(req, res);

      expect(Comment).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Thêm bình luận thành công!",
        statusCode: 200,
      });
    });

    it("should create a comment and mark it as toxic if sentiment is negative", async () => {
      const mockSave = jest.fn().mockResolvedValueOnce(newComment);
      Comment.prototype.save = mockSave;
      axios.post.mockResolvedValueOnce({ data: { sentiment: "NEGATIVE" } });

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Thêm bình luận thành công!",
        statusCode: 200,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle classification errors and return a 500 status code", async () => {
      const classificationError = new Error("Classification error");
      axios.post.mockRejectedValueOnce(classificationError);

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: "Classification error",
      });
      expect(Comment.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe("createReplyComment", () => {
    req = {
      body: {
        content: "This is a test reply comment",
        account: "testAccountId",
        post: "testPostId",
        parent_comment: "testParentCommentId"
      },
    };
    it('should create a reply comment successfully with a positive sentiment', async () => {
      const mockSave = jest.fn().mockResolvedValueOnce({
        _id: "newCommentId",
        content: "This is a test reply comment",
        account: "testAccountId",
        post: "testPostId",
        parent_comment: "testParentCommentId",
        save: jest.fn().mockResolvedValueOnce({}),
        populate: jest.fn().mockResolvedValueOnce({})
      });
      Comment.prototype.save = mockSave;
      axios.post.mockResolvedValueOnce({ data: { sentiment: "POSITIVE" } });
      Comment.findById.mockResolvedValueOnce({
        _id: "testParentCommentId",
        replies: [],
        save: jest.fn().mockResolvedValueOnce({})
      });
  
      await createReplyComment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Trả lời bình luận thành công!",
        data: expect.objectContaining({
          content: "This is a test reply comment",
          account: "testAccountId",
          post: "testPostId",
          parent_comment: "testParentCommentId"
        })
      });
      expect(mockSave).toHaveBeenCalled();
      expect(Comment.findById).toHaveBeenCalledWith("testParentCommentId");
    });
  
    it('should create a reply comment and mark it as toxic if sentiment is negative', async () => {
      const mockSave = jest.fn().mockResolvedValueOnce({
        _id: "newCommentId",
        content: "This is a test reply comment",
        account: "testAccountId",
        post: "testPostId",
        parent_comment: "testParentCommentId",
        is_toxic: true,
        save: jest.fn().mockResolvedValueOnce({}),
        populate: jest.fn().mockResolvedValueOnce({})
      });
      Comment.prototype.save = mockSave;
      axios.post.mockResolvedValueOnce({ data: { sentiment: "NEGATIVE" }});
      Comment.findById.mockResolvedValueOnce({
        _id: "testParentCommentId",
        replies: [],
        save: jest.fn().mockResolvedValueOnce({})
      });
  
      await createReplyComment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Trả lời bình luận thành công!",
        data: expect.objectContaining({
          content: "This is a test reply comment",
          account: "testAccountId",
          post: "testPostId",
          parent_comment: "testParentCommentId",
          is_toxic: true
        })
      });
      expect(mockSave).toHaveBeenCalled();
      expect(Comment.findById).toHaveBeenCalledWith("testParentCommentId");
    });
  
  
    it('should handle classification errors and return a 400 status code', async () => {
      const classificationError = new Error('Classification error');
      axios.post.mockRejectedValueOnce(classificationError);
  
      await createReplyComment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classification error",
      });
      expect(Comment.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe("getAllCommentsByUserId", () => {
    it("should get all comments by user ID", async () => {
      const req = {
        body: {
          account: "userId123",
          post: "postId123",
          is_approved: true,
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
        is_approved: true,
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
