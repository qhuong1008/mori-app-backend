const readHistory = require("../model/readHistory.model");
const {
  createOrUpdateReadHistory,
  findAll,
  findAllWithUser,
  findOne,
} = require("../controller/readHistory.controller");

jest.mock("../model/readHistory.model");

describe("ReadHistory Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createOrUpdateReadHistory", () => {
    it("should create a new read history if none exists", async () => {
      const bookId = "bookId123";
      const userId = "userId123";
      const position = "epubcfi(/6/2!/4/1:0)";
      req.body = { book: bookId, user: userId, position: position };

      readHistory.findOne.mockResolvedValueOnce(null);
      readHistory.create.mockResolvedValueOnce({});

      await createOrUpdateReadHistory(req, res);

      expect(readHistory.findOne).toHaveBeenCalledWith({
        book: bookId,
        user: userId,
      });
      expect(readHistory.create).toHaveBeenCalledWith({
        book: bookId,
        user: userId,
        time: expect.any(String),
        position: position,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Lịch sử đọc đã được cập nhật.",
      });
    });

    it("should update an existing read history", async () => {
      const bookId = "bookId123";
      const userId = "userId123";
      const position = 42;
      req.body = { book: bookId, user: userId, position: position };

      const existingHistory = {
        book: bookId,
        user: userId,
        position: "epubcfi(/6/2!/4/1:0)",
        time: "2024-01-01",
        save: jest.fn().mockResolvedValueOnce({}),
      };
      readHistory.findOne.mockResolvedValueOnce(existingHistory);

      await createOrUpdateReadHistory(req, res);

      expect(readHistory.findOne).toHaveBeenCalledWith({
        book: bookId,
        user: userId,
      });
      expect(existingHistory.position).toBe(position);
      expect(existingHistory.time).toEqual(expect.any(String));
      expect(existingHistory.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Lịch sử đọc đã được cập nhật.",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.body = {
        book: "bookId123",
        user: "userId123",
        position: "epubcfi(/6/2!/4/1:0)",
      };

      readHistory.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await createOrUpdateReadHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: "Đã có lỗi xảy ra.",
      });
    });
  });

  describe("findAll", () => {
    it("should return all read histories with status code 200", async () => {
      const mockReadHistories = [
        { _id: "1", book: "book1" },
        { _id: "2", book: "book2" },
      ];
      const mockExec = jest.fn().mockResolvedValueOnce(mockReadHistories);
      const mockPopulate = jest.fn().mockReturnThis();
      readHistory.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findAll(req, res);

      expect(readHistory.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        readHistorys: mockReadHistories,
        statusCode: 200,
      });
    });
  });

  describe("findAllWithUser", () => {
    it("should return all read histories for a specific user with status code 200", async () => {
      const userId = "userId123";
      const mockReadHistories = [
        { _id: "1", book: "book1", user: userId },
        { _id: "2", book: "book2", user: userId },
      ];
      req.params.id = userId;
      const mockExec = jest.fn().mockResolvedValueOnce(mockReadHistories);
      const mockPopulate = jest.fn().mockReturnThis();
      readHistory.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findAllWithUser(req, res);

      expect(readHistory.find).toHaveBeenCalledWith({ user: userId });
      expect(res.json).toHaveBeenCalledWith({
        readHistory: mockReadHistories,
        statusCode: 200,
      });
    });
  });

  describe("findOne", () => {
    it("should return the reading position if history exists", async () => {
      const bookId = "bookId123";
      const userId = "userId123";
      const mockHistory = {
        book: bookId,
        user: userId,
        position: "epubcfi(/6/2!/4/1:0)",
      };
      req.params.book_id = bookId;
      req.params.user_id = userId;
      readHistory.findOne.mockResolvedValueOnce(mockHistory);

      await findOne(req, res);

      expect(readHistory.findOne).toHaveBeenCalledWith({
        book: bookId,
        user: userId,
      });
      expect(res.json).toHaveBeenCalledWith({
        position: mockHistory.position,
        statusCode: 200,
      });
    });

    it("should return 404 if no reading history is found", async () => {
      const bookId = "bookId123";
      const userId = "userId123";
      req.params.book_id = bookId;
      req.params.user_id = userId;
      readHistory.findOne.mockResolvedValueOnce(null);

      await findOne(req, res);

      expect(readHistory.findOne).toHaveBeenCalledWith({
        book: bookId,
        user: userId,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Không có lịch sử đọc trước đó",
        statusCode: 404,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      const bookId = "bookId123";
      const userId = "userId123";
      req.params.book_id = bookId;
      req.params.user_id = userId;
      readHistory.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: "Đã có lỗi xảy ra.",
      });
    });
  });
});
