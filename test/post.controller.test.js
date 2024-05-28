const postModel = require("../model/post.model");
const {
  findAll,
  findById,
  findByUserId,
  deletePost,
  createPost,
  editPost,
  uploadImage,
  likePost,
  sharePost,
} = require("../controller/post.controller");
const imageController = require("../controller/image.controller");
jest.mock("../controller/image.controller", () => {
  return {
    ...jest.requireActual("../controller/image.controller"),
    isValidImageFormat: jest.fn(),
  };
});

jest.mock("../model/post.model");

describe("Post Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all posts with populated fields and status code 200", async () => {
      const mockPosts = [{ _id: "post1" }, { _id: "post2" }];

      const mockExec = jest.fn().mockResolvedValueOnce(mockPosts);
      const mockPopulate = jest.fn().mockReturnThis();
      postModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findAll(req, res);

      expect(postModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        posts: mockPosts,
        statusCode: 200,
      });
    });

    // it("should handle errors and return a 500 status code", async () => {
    //   const errorMessage = "Test error";
    //   const mockPopulate = jest.fn().mockReturnThis();
    //   const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    //   postModel.find.mockReturnValueOnce({ populate: mockPopulate });
    //   mockPopulate.mockReturnValueOnce({ exec: mockExec });

    //   await findAll(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ err: errorMessage });
    // });
  });

  describe("findById", () => {
    it("should return a post by id with populated fields and status code 200", async () => {
      const postId = "postId123";
      const mockPost = { _id: postId };
      req.params.id = postId;

      const mockExec = jest.fn().mockResolvedValueOnce(mockPost);
      const mockPopulate = jest.fn().mockReturnThis();
      postModel.findById.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findById(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(res.json).toHaveBeenCalledWith({
        post: mockPost,
        statusCode: 200,
      });
    });

    // it("should handle errors and return a 500 status code", async () => {
    //   const postId = "postId123";
    //   const errorMessage = "Test error";
    //   req.params.id = postId;

    //   const mockPopulate = jest.fn().mockReturnThis();
    //   const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    //   postModel.findById.mockReturnValueOnce({ populate: mockPopulate });
    //   mockPopulate.mockReturnValueOnce({ exec: mockExec });

    //   await findById(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ err: errorMessage });
    // });
  });

  describe("findByUserId", () => {
    it("should return posts by user id with populated fields and status code 200", async () => {
      const userId = "userId123";
      const mockPosts = [{ _id: "post1" }, { _id: "post2" }];
      req.params.id = userId;

      const mockExec = jest.fn().mockResolvedValueOnce(mockPosts);
      const mockPopulate = jest.fn().mockReturnThis();
      postModel.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findByUserId(req, res);

      expect(postModel.find).toHaveBeenCalledWith({ account: userId });
      expect(res.json).toHaveBeenCalledWith({
        data: mockPosts,
        statusCode: 200,
      });
    });

    // it("should handle errors and return a 500 status code", async () => {
    //   const userId = "userId123";
    //   const errorMessage = "Test error";
    //   req.params.id = userId;

    //   const mockPopulate = jest.fn().mockReturnThis();
    //   const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    //   postModel.find.mockReturnValueOnce({ populate: mockPopulate });
    //   mockPopulate.mockReturnValueOnce({ exec: mockExec });

    //   await findByUserId(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ err: errorMessage });
    // });
  });

  describe("deletePost", () => {
    it("should delete a post and return a success message with status code 200", async () => {
      const postId = "postId123";
      const mockDeletedPost = { _id: postId };
      req.params.id = postId;

      postModel.findByIdAndDelete.mockResolvedValueOnce(mockDeletedPost);

      await deletePost(req, res);

      expect(postModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post deleted successfully",
        deletedPost: mockDeletedPost,
      });
    });

    it("should handle when post not found and return status code 404", async () => {
      const postId = "postId123";
      req.params.id = postId;

      postModel.findByIdAndDelete.mockResolvedValueOnce(null);

      await deletePost(req, res);

      expect(postModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      const postId = "postId123";
      const errorMessage = "Test error";
      req.params.id = postId;

      postModel.findByIdAndDelete.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error(errorMessage) });
    });
  });

  describe("createPost", () => {
    it("should create a new post and return a success message with status code 200", async () => {
      const mockPostData = {
        title: "Test title",
        content: "Test content",
        account: "accountId123",
        tag: "tagId123",
        image: "imageId123",
        book: "bookId123",
      };
      req.body = mockPostData;

      const mockSavedPost = { _id: "postId123" };

      postModel.mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(mockSavedPost),
      });

      await createPost(req, res);

      expect(postModel).toHaveBeenCalledWith(mockPostData);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bài viết được tạo thành công!",
      });
    });

    it("should handle missing title or content and return status code 400", async () => {
      const mockPostData = {
        content: "Test content",
      };
      req.body = mockPostData;

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Vui lòng nhập đủ thông tin bài viết!",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.body = {
        title: "Test title",
        content: "Test content",
      };

      postModel.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      });

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Tạo bài viết thất bại! Vui lòng thử lại!",
      });
    });
  });

  describe("editPost", () => {
    it("should edit a post and return a success message with status code 200", async () => {
      const postId = "postId123";
      const updatedPostData = {
        title: "Updated title",
        content: "Updated content",
        tag: "Updated tag",
        image: "Updated image",
        book: "Updated book",
      };
      req.params.id = postId;
      req.body = updatedPostData;

      const mockUpdatedPost = {
        _id: postId,
        save: jest.fn(),
      };
      postModel.findById.mockResolvedValueOnce(mockUpdatedPost);

      await editPost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(mockUpdatedPost.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bài viết được cập nhật thành công!",
      });
    });

    it("should handle when post not found and return status code 404", async () => {
      const postId = "postId123";
      req.params.id = postId;

      postModel.findById.mockResolvedValueOnce(null);

      await editPost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bài viết không tìm thấy!",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const postId = "postId123";
      const errorMessage = "Test error";
      req.params.id = postId;

      postModel.findById.mockRejectedValueOnce(new Error(errorMessage));

      await editPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Cập nhật bài viết thất bại! Vui lòng thử lại!",
      });
    });
  });

  describe("uploadImage", () => {
    let req, res;

    beforeEach(() => {
      req = { file: null };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it("should return a 400 error if no file is uploaded", async () => {
      await uploadImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
    });

    it("should return a 400 error if an invalid image format is uploaded", async () => {
      const mockFile = { filename: "image.png" };
      req.file = mockFile;

      imageController.isValidImageFormat.mockReturnValueOnce(false);

      await uploadImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid image format!" });
    });

    it("should upload the file successfully and return a 200 status code with file name", async () => {
      const mockFile = { filename: "image.jpg" };
      req.file = mockFile;

      imageController.isValidImageFormat.mockImplementation((mockFile) => {
        return mockFile.filename.endsWith(".jpg");
      });

      await uploadImage(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "File uploaded successfully!",
        filename: mockFile.filename,
      });
    });

    it("should handle errors and return a 400 status code with error message", async () => {
      const errorMessage = "Test error";
      req.file = { filename: "image.jpg" };

      imageController.isValidImageFormat.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await uploadImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ err: new Error(errorMessage) });
    });
  });

  describe("likePost", () => {
    it("should like a post if not already liked and return 'Hearted!'", async () => {
      const postId = "postId123";
      const accountId = "accountId123";
      req.params.id = postId;
      req.body.accountId = accountId;

      const mockPostData = { _id: postId, likes: [], save: jest.fn() };
      postModel.findById.mockResolvedValueOnce(mockPostData);

      await likePost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostData.likes).toContain(accountId);
      expect(mockPostData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Hearted!" });
    });

    it("should unlike a post if already liked and return 'Unhearted!'", async () => {
      const postId = "postId123";
      const accountId = "accountId123";
      req.params.id = postId;
      req.body.accountId = accountId;

      const mockPostData = { _id: postId, likes: [accountId], save: jest.fn() };
      postModel.findById.mockResolvedValueOnce(mockPostData);

      await likePost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostData.likes).not.toContain(accountId);
      expect(mockPostData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Unhearted!" });
    });

    it("should return 404 if post is not found", async () => {
      const postId = "postId123";
      req.params.id = postId;
      req.body.accountId = "accountId123";

      postModel.findById.mockResolvedValueOnce(null);

      await likePost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Không tìm thấy bài viết.",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const postId = "postId123";
      const errorMessage = "Test error";
      req.params.id = postId;
      req.body.accountId = "accountId123";

      postModel.findById.mockRejectedValueOnce(new Error(errorMessage));

      await likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("sharePost", () => {
    it("should share a post and return 'Post shared!'", async () => {
      const postId = "postId123";
      const accountId = "accountId123";
      req.params.id = postId;
      req.body.accountId = accountId;

      const mockPostData = { _id: postId, shares: [], save: jest.fn() };
      postModel.findById.mockResolvedValueOnce(mockPostData);

      await sharePost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostData.shares).toContain(accountId);
      expect(mockPostData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Post shared!" });
    });

    it("should return 404 if post is not found", async () => {
      const postId = "postId123";
      req.params.id = postId;
      req.body.accountId = "accountId123";

      postModel.findById.mockResolvedValueOnce(null);

      await sharePost(req, res);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Không tìm thấy bài viết.",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const postId = "postId123";
      const errorMessage = "Test error";
      req.params.id = postId;
      req.body.accountId = "accountId123";

      postModel.findById.mockRejectedValueOnce(new Error(errorMessage));

      await sharePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
