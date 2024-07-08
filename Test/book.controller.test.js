//import các module vào code
const Book = require("../model/book.model");
const bookController = require("../controller/book.controller");

// Mocking the book model
//Giả lập phương thức
jest.mock("../model/book.model");

describe("Book Controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new book and return success message", async () => {
      const req = { body: { title: "Test Book", author: "Test Author" } };
      Book.prototype.save.mockResolvedValueOnce();
      await bookController.create(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Book added successfully!",
      });
    });

    it("should handle error while creating a new book", async () => {
      const errorMessage = "Test error";
      Book.prototype.save.mockRejectedValueOnce(new Error(errorMessage));

      const req = { body: { title: "Test Book", author: "Test Author" } };
      await bookController.create(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add book",
        error: errorMessage,
      });
    });
  });

  describe("findBookWithSearchValue", () => {
    it("should return books matching the search value", async () => {
      const mockSearchValue = "test book";
      const mockBooks = [
        {
          _id: "123",
          name: "Test Book",
          chapters: [],
        },
        {
          _id: "234",
          name: "Test Book",
          chapters: [],
        },
      ];
      const mockExec = jest.fn().mockResolvedValue(mockBooks);
      const mockPopulate = jest.fn().mockReturnThis();

      Book.find.mockReturnValue({
        $text: { $search: mockSearchValue },
        populate: mockPopulate,
        exec: mockExec,
      });

      const req = { body: { searchValue: mockSearchValue } };
      await bookController.findBookWithSearchValue(req, res);

      expect(Book.find).toHaveBeenCalledWith({
        $text: { $search: mockSearchValue },
      });
      expect(res.json).toHaveBeenCalledWith({
        books: mockBooks,
        statusCode: 200,
      });
    });
  });

  describe("findBookByCategory", () => {
    it("should return books belonging to the specified category", async () => {
      const mockSearchValue = "some-category";
      const mockBooks = [
        {
          _id: "123",
          name: "Test Book",
          chapters: [],
        },
        {
          _id: "234",
          name: "Test Book",
          chapters: [],
        },
      ];
      const mockExec = jest.fn().mockResolvedValue(mockBooks);
      const mockPopulate = jest.fn().mockReturnThis();

      Book.find.mockReturnValue({
        $text: { $search: mockSearchValue },
        populate: mockPopulate,
        exec: mockExec,
      });

      const req = { body: { searchValue: mockSearchValue } };
      await bookController.findBookByCategory(req, res);

      expect(Book.find).toHaveBeenCalledWith({
        tags: { $in: [mockSearchValue] },
      });
      expect(res.json).toHaveBeenCalledWith({
        books: mockBooks,
        statusCode: 200,
      });
    });
  });

  // hàm test increaseTotalHearted tương tự
  describe("increaseTotalRead", () => {
    it("should increase the totalRead count of a book by 1", async () => {
      const bookId = "12345";
      const req = {
        params: {
          id: bookId,
        },
      };
      const mockBook = { _id: bookId, totalRead: 0, updateOne: jest.fn() };
      Book.findById.mockResolvedValueOnce(mockBook);

      await bookController.increaseTotalRead(req, res);

      expect(Book.findById).toHaveBeenCalledWith(bookId);
      expect(mockBook.updateOne).toHaveBeenCalledWith({
        $inc: { totalRead: 1 },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Increased by 1!",
        statusCode: 200,
      });
    });

    it("should handle errors when increasing totalRead count", async () => {
      const error = new Error("Some error occurred");
      Book.findById.mockRejectedValue(error);
      const bookId = "12345";
      const req = {
        params: {
          id: bookId,
        },
      };

      await bookController.increaseTotalRead(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: error, statusCode: 500 });
    });
  });

  describe("updateTotalSaved", () => {
    it("should update the totalSaved array of a book with the specified user", async () => {
      const bookId = "some-book-id";
      const mockBook = { _id: bookId, totalRead: 0, updateOne: jest.fn() };
      const user = "some-user";
      const req = {
        params: {
          id: bookId,
        },
        body: {
          user,
        },
      };
      Book.findById.mockResolvedValue(mockBook);
      Book.findOne.mockResolvedValue(null);

      await bookController.updateTotalSaved(req, res);

      expect(Book.findById).toHaveBeenCalledWith(bookId);
      expect(Book.findOne).toHaveBeenCalledWith({
        _id: bookId,
        totalSaved: { $elemMatch: { $eq: user } },
      });
      expect(mockBook.updateOne).toHaveBeenCalledWith(
        { $push: { totalSaved: user } },
        { upsert: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Saved into library!",
        statusCode: 200,
      });
    });

    it("should return a message if the user already saved the book", async () => {
      const bookId = "some-book-id";
      const mockBook = { _id: bookId, totalRead: 0, updateOne: jest.fn() };
      const user = "some-user";
      const req = {
        params: {
          id: bookId,
        },
        body: {
          user,
        },
      };
      Book.findById.mockResolvedValue(mockBook);
      Book.findOne.mockResolvedValue(mockBook);

      await bookController.updateTotalSaved(req, res);

      expect(Book.findById).toHaveBeenCalledWith(bookId);
      expect(Book.findOne).toHaveBeenCalledWith({
        _id: bookId,
        totalSaved: { $elemMatch: { $eq: user } },
      });
      expect(mockBook.updateOne).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "This user already saved the book into his library.",
        statusCode: 200,
      });
    });

    it("should handle errors when updating totalSaved", async () => {
      const error = new Error("Some error occurred");
      Book.findById.mockRejectedValue(error);
      const req = {
        params: {
          id: "some-book-id",
        },
      };

      await bookController.updateTotalSaved(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: error, statusCode: 500 });
    });
  });
});
