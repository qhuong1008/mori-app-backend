const {
  create,
  addBookToMyLibrary,
  getAllBooksInMyLibrary,
  deleteBookFromMyLibrary,
  findAll,
  findOne,
} = require("../controller/myLibrary.controller");
const MyLibrary = require("../model/myLibrary.model");

jest.mock("../model/myLibrary.model");

describe("MyLibrary Controller", () => {
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
    const req = {
      body: { title: "New Book", author: "Author Name" },
    };
    it("should create a new library entry", async () => {
      MyLibrary.findOne.mockResolvedValueOnce(null);
      MyLibrary.prototype.save.mockResolvedValueOnce();

      await create(req, res);

      expect(res.json).toHaveBeenCalledWith("My library added successfully!");
    });

    it("should return message if library entry already exists", async () => {
      MyLibrary.findOne.mockResolvedValueOnce({});

      await create(req, res);

      expect(res.json).toHaveBeenCalledWith("My library already exists!");
    });
  });

  describe("addBookToMyLibrary", () => {
    const req = {
      body: { title: "Existing Book", author: "Author Name" },
    };
    it("should return 1 if the book already exists in the library", async () => {
      MyLibrary.findOne.mockResolvedValueOnce({});

      await addBookToMyLibrary(req, res);

      expect(MyLibrary.findOne).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    it("should add a new book to the library and return 0", async () => {
      MyLibrary.findOne.mockResolvedValueOnce(null);

      const saveMock = jest.fn();
      const newBookInMyLibraryMock = jest.fn(() => ({ save: saveMock }));
      MyLibrary.mockImplementationOnce(newBookInMyLibraryMock);

      await addBookToMyLibrary(req, res);

      expect(MyLibrary.findOne).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(0);
    });

    it("should handle errors and return a 500 status code", async () => {
      const req = {
        body: { title: "Book with Error", author: "Author Name" },
      };
      const errorMessage = "Test error";
      MyLibrary.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await addBookToMyLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: new Error(errorMessage),
      });
    });
  });

  describe("getAllBooksInMyLibrary", () => {
    const req = {
      params: { id: "user_id" },
    };

    it("should return all books in the user library", async () => {
      const mockLibraryResult = [
        { book: { title: "Book 1" } },
        { book: { title: "Book 2" } },
      ];

      const mockExec = jest.fn().mockResolvedValueOnce(mockLibraryResult);
      const mockPopulate = jest.fn().mockReturnThis();
      MyLibrary.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await getAllBooksInMyLibrary(req, res);

      expect(MyLibrary.find).toHaveBeenCalledWith({ user: "user_id" });
      expect(res.json).toHaveBeenCalledWith({ myLibrary: mockLibraryResult });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      MyLibrary.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await getAllBooksInMyLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: new Error(errorMessage),
      });
    });
  });

  describe("deleteBookFromMyLibrary", () => {
    const req = {
      body: { book: "book_id" },
    };
    it("should delete a book from the library and return 0", async () => {
      MyLibrary.deleteOne.mockResolvedValueOnce({});

      await deleteBookFromMyLibrary(req, res);

      expect(MyLibrary.deleteOne).toHaveBeenCalledWith({ book: "book_id" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(0);
    });

    it("should handle book not found and return 404", async () => {
      MyLibrary.deleteOne.mockResolvedValueOnce(null);

      await deleteBookFromMyLibrary(req, res);

      expect(MyLibrary.deleteOne).toHaveBeenCalledWith({ book: "book_id" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(404);
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      MyLibrary.deleteOne.mockRejectedValueOnce(new Error(errorMessage));

      await deleteBookFromMyLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("findAll", () => {
    it("should return all library entries", async () => {
      const req = {};
      const mockLibraries = [
        { book: { title: "Book 1" } },
        { book: { title: "Book 2" } },
      ];
      const mockExec = jest.fn().mockResolvedValueOnce(mockLibraries);
      const mockPopulate = jest.fn().mockReturnThis();
      MyLibrary.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findAll(req, res);

      expect(MyLibrary.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        myLibraries: mockLibraries,
        statusCode: 200,
      });
    });
  });

  describe("findOne", () => {
    it("should return a library entry by query", async () => {
      const req = {
        body: { book: "book_id" },
      };
      const mockLibrary = { book: { title: "Book 1" } };

      const mockExec = jest.fn().mockResolvedValueOnce(mockLibrary);
      const mockPopulate = jest.fn().mockReturnThis();
      MyLibrary.findOne.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await findOne(req, res);
      expect(MyLibrary.findOne).toHaveBeenCalledWith({ book: "book_id" });
      expect(res.json).toHaveBeenCalledWith({
        myLibrary: mockLibrary,
        statusCode: 200,
      });
    });
  });
});
