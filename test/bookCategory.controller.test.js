const {
  createBookCategory,
  update,
  delete: deleteBookCategory, // delete is a reserved keyword, so we alias it to deleteBookCategory
} = require("../controller/bookCategory.controller");
const BookCategory = require("../model/bookCategory.model");

jest.mock("../model/bookCategory.model");

describe("Book Category Controller", () => {
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new book category", async () => {
      const req = {
        body: { tag: "fantasy", name: "Fantasy Books" },
      };
      BookCategory.findOne.mockResolvedValueOnce(null);

      await createBookCategory(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Book category added successfully!",
      });
    });

    it("should return message if book category already exists", async () => {
      const req = {
        body: { tag: "fantasy", name: "Fantasy Books" },
      };
      BookCategory.findOne.mockResolvedValueOnce({});

      await createBookCategory(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "BookCategory already exist!",
      });
    });
  });

  describe("update", () => {
    beforeEach(() => {
      req = {
        params: { id: "12345" },
        body: { tag: "new-fantasy", name: "New Fantasy Books" },
      };
    });

    it("should update a book category", async () => {
      const mockCategory = {
        _id: "12345",
        tag: "fantasy",
        name: "Fantasy Books",
        save: jest.fn(),
      };
      BookCategory.findById.mockResolvedValueOnce(mockCategory);

      await update(req, res);

      expect(BookCategory.findById).toHaveBeenCalledWith("12345");

      expect(mockCategory.tag).toBe("new-fantasy");
      expect(mockCategory.name).toBe("New Fantasy Books");
      expect(mockCategory.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "BookCategory updated successfully",
        updatedBookCategory: mockCategory,
      });
    });

    it("should return message if book category is not found", async () => {
      BookCategory.findById.mockResolvedValueOnce(null);

      await update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "BookCategory not found",
      });
    });

    it("should handle error", async () => {
      const errorMessage = "Test error";
      BookCategory.findById.mockRejectedValueOnce(new Error(errorMessage));

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteBookCategory", () => {
    beforeEach(() => {
      req = {
        params: { id: "12345" },
      };
    });

    it("should delete a book category by id", async () => {
      const mockCategory = {
        _id: "12345",
        tag: "fantasy",
        name: "Fantasy Books",
      };
      BookCategory.findByIdAndDelete.mockResolvedValueOnce(mockCategory);

      await deleteBookCategory(req, res);

      expect(BookCategory.findByIdAndDelete).toHaveBeenCalledWith("12345");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tag deleted successfully",
        deleteBookCategory: mockCategory,
      });
    });

    it("should return message if book category is not found", async () => {
      BookCategory.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteBookCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tag not found" });
    });

    it("should handle error", async () => {
      const errorMessage = "Test error";
      BookCategory.findByIdAndDelete.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await deleteBookCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
