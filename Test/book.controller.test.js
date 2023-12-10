//import các module vào code
const book = require("../model/book.model");
const {
  create,
  findAll,
  findById,
  findBookWithSearchValue,
  findBookByCategory,
  findOne,
  increaseTotalRead,
  updateTotalSaved,
  update,
  delete: deleteBook,
} = require("../controller/book.controller");

// Mocking the request and response objects
// Giả lập đối tượng
const req = {
  body: {},
  params: {},
};

const res = {
  json: jest.fn().mockReturnValue(this),
  status: jest.fn().mockReturnValue(this),
};

// Mocking the book model
//Giả lập phương thức
jest.mock("../model/book.model", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
}));

describe("Book Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    //Định nghĩa unit test
    it("should create a new book and return success message", async () => {
      const bookMock = {
        save: jest.fn().mockResolvedValue(),
      };
      const saveMock = jest.spyOn(bookMock, "save");
      req.body = {};

      await create(req, res);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        message: "Book added successfully!",
      });
    });

    it("should handle errors during book creation", async () => {
      const error = new Error("Some error occurred");
      bookMock.save.mockRejectedValue(error);
      req.body = {};

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error, statusCode: 500 });
    });
  });

  describe("findAll", () => {
    it("should return all books", async () => {
      const books = [
        {
          /* book data */
        },
      ];
      book.find.mockResolvedValue(books);

      await findAll(req, res);

      expect(book.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({ books: books, statusCode: 200 });
    });
  });

  describe("findById", () => {
    it("should return a book by its ID", async () => {
      const bookResult = {};
      const bookId = "some-book-id";
      book.findById.mockResolvedValue(bookResult);
      req.params.id = bookId;

      await findById(req, res);

      expect(book.findById).toHaveBeenCalledWith(bookId);
      expect(res.json).toHaveBeenCalledWith({
        book: bookResult,
        statusCode: 200,
      });
    });

    it("should handle errors when finding a book by ID", async () => {
      const error = new Error("Some error occurred");
      book.findById.mockRejectedValue(error);
      req.params.id = "some-book-id";

      await findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });

  describe("findBookWithSearchValue", () => {
    it("should return books matching the search value", async () => {
      const searchValue = "some-search-value";
      const result = [
        {
          /* book data */
        },
      ];
      req.body.searchValue = searchValue;
      book.find.mockResolvedValue(result);

      await findBookWithSearchValue(req, res);

      expect(book.find).toHaveBeenCalledWith({
        $text: { $search: searchValue },
      });
      expect(res.json).toHaveBeenCalledWith({ books: result, statusCode: 200 });
    });
  });

  describe("findBookByCategory", () => {
    it("should return books belonging to the specified category", async () => {
      const searchValue = "some-category";
      const result = [
        {
          /* book data */
        },
      ];
      req.body.searchValue = searchValue;
      book.find.mockResolvedValue(result);

      await findBookByCategory(req, res);

      expect(book.find).toHaveBeenCalledWith({ tags: { $in: [searchValue] } });
      expect(res.json).toHaveBeenCalledWith({ books: result, statusCode: 200 });
    });
  });

  describe("findOne", () => {
    it("should return a book matching the specified criteria", async () => {
      const criteria = {
        /* criteria for finding a book */
      };
      const result = {
        /* book data */
      };
      req.body = criteria;
      book.findOne.mockResolvedValue(result);

      await findOne(req, res);

      expect(book.findOne).toHaveBeenCalledWith(criteria);
      expect(res.json).toHaveBeenCalledWith({ book: result, statusCode: 200 });
    });
  });

  describe("increaseTotalRead", () => {
    it("should increase the totalRead count of a book by 1", async () => {
      const bookResult = {
        /* book data */
      };
      const bookId = "some-book-id";
      req.params.id = bookId;
      book.findById.mockResolvedValue(bookResult);

      await increaseTotalRead(req, res);

      expect(book.findById).toHaveBeenCalledWith(bookId);
      expect(bookResult.updateOne).toHaveBeenCalledWith({
        $inc: { totalRead: 1 },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Increased by 1!",
        statusCode: 200,
      });
    });

    it("should handle errors when increasing totalRead count", async () => {
      const error = new Error("Some error occurred");
      book.findById.mockRejectedValue(error);
      req.params.id = "some-book-id";

      await increaseTotalRead(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: error, statusCode: 500 });
    });
  });

  describe("updateTotalSaved", () => {
    it("should update the totalSaved array of a book with the specified user", async () => {
      const bookResult = {
        /* book data */
      };
      const bookId = "some-book-id";
      const user = "some-user";
      req.params.id = bookId;
      req.body.user = user;
      book.findById.mockResolvedValue(bookResult);
      book.findOne.mockResolvedValue(null);

      await updateTotalSaved(req, res);

      expect(book.findById).toHaveBeenCalledWith(bookId);
      expect(book.findOne).toHaveBeenCalledWith({
        _id: bookId,
        totalSaved: { $elemMatch: { $eq: user } },
      });
      expect(bookResult.updateOne).toHaveBeenCalledWith(
        { $push: { totalSaved: user } },
        { upsert: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Saved into library!",
        statusCode: 200,
      });
    });

    it("should return a message if the user already saved the book", async () => {
      const bookResult = {
        /* book data */
      };
      const bookId = "some-book-id";
      const user = "some-user";
      req.params.id = bookId;
      req.body.user = user;
      book.findById.mockResolvedValue(bookResult);
      book.findOne.mockResolvedValue(bookResult);

      await updateTotalSaved(req, res);

      expect(book.findById).toHaveBeenCalledWith(bookId);
      expect(book.findOne).toHaveBeenCalledWith({
        _id: bookId,
        totalSaved: { $elemMatch: { $eq: user } },
      });
      expect(bookResult.updateOne).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "This user already saved the book into his library.",
        statusCode: 200,
      });
    });

    it("should handle errors when updating totalSaved", async () => {
      const error = new Error("Some error occurred");
      book.findById.mockRejectedValue(error);
      req.params.id = "some-book-id";

      await updateTotalSaved(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: error, statusCode: 500 });
    });
  });
});
