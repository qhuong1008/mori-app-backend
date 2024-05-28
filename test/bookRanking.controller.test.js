const {
  increaseTotalReadDaily,
  getBookRanking,
  getBookRankingPreviousOfBook,
  updateTotalRead,
} = require("../controller/bookRanking.controller");
const BookRanking = require("../model/bookRanking.model");
const Book = require("../model/book.model");
const mongoose = require("mongoose");

jest.mock("../model/bookRanking.model");
jest.mock("../model/book.model", () => ({
  updateOne: jest.fn(),
}));

describe("BookRanking Controller", () => {
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("increaseTotalReadDaily", () => {
    it("should increase total read daily if book ranking exists", async () => {
      const req = {
        params: { id: "book123" },
      };
      const mockBookRanking = {
        totalRead: 5,
        updateOne: jest.fn(),
      };
      BookRanking.findOne.mockResolvedValueOnce(mockBookRanking);

      await increaseTotalReadDaily(req, res);

      expect(BookRanking.findOne).toHaveBeenCalled();
      expect(mockBookRanking.updateOne).toHaveBeenCalledWith({
        $inc: {
          totalRead: 1,
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Increase total read daily successfully!",
        totalRead: mockBookRanking.totalRead,
        statusCode: 200,
      });
    });

    it("should create a new book ranking if not exists", async () => {
      const req = {
        params: { id: "book123" },
      };
      const mockNewBookRanking = {
        updateOne: jest.fn(),
      };
      BookRanking.findOne.mockResolvedValueOnce(null);

      BookRanking.create.mockResolvedValueOnce(mockNewBookRanking);
      await increaseTotalReadDaily(req, res);
      expect(BookRanking.create).toHaveBeenCalledWith({ book_id: "book123" });
      expect(mockNewBookRanking.updateOne).toHaveBeenCalledWith({
        $inc: {
          totalRead: 1,
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining("Book ranking of"),
        statusCode: 201,
      });
    });

    it("should handle error", async () => {
      const req = {
        params: { id: "book123" },
      };
      const errorMessage = "Test error";
      BookRanking.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await increaseTotalReadDaily(req, res);

      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        statusCode: 500,
      });
    });
  });

  describe("getBookRanking", () => {
    it("should return book ranking for daily interval", async () => {
      const req = {
        params: { interval: "daily" },
      };
      const mockRankingData = [
        {
          book_id: "book123",
          totalRead: 10,
          bookInfo: {
            title: "Book Title",
            author: "Author Name",
          },
        },
      ];
      BookRanking.aggregate.mockResolvedValueOnce(mockRankingData);

      await getBookRanking(req, res);

      expect(BookRanking.aggregate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        rankingData: mockRankingData,
        statusCode: 200,
      });
    });

    it("should return invalid interval message for invalid interval", async () => {
      const req = {
        params: { interval: "invalid" },
      };

      await getBookRanking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({ message: "Invalid interval" });
    });

    it("should handle error", async () => {
      const req = {
        params: { interval: "daily" },
      };
      const errorMessage = "Test error";
      BookRanking.aggregate.mockRejectedValueOnce(new Error(errorMessage));

      await getBookRanking(req, res);

      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        statusCode: 500,
      });
    });
  });

  describe("getBookRankingPreviousOfBook", () => {
    it("should return total read count for the previous days", async () => {
      const req = {
        params: { book_id: "book123", previous: "2" },
      };
      const mockBookRankings = [{ totalRead: 5 }, { totalRead: 3 }];
      BookRanking.find.mockResolvedValueOnce(mockBookRankings);

      await getBookRankingPreviousOfBook(req, res);

      expect(BookRanking.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        totalReadCount: 8,
        statusCode: 200,
      });
    });

    it("should return message if no ranking found", async () => {
      const req = {
        params: { book_id: "book123", previous: "2" },
      };
      BookRanking.find.mockResolvedValueOnce([]);

      await getBookRankingPreviousOfBook(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "No ranking found for 2 the date before.",
        statusCode: 404,
      });
    });

    it("should handle error", async () => {
      const req = {
        params: { book_id: "book123", previous: "2" },
      };
      const errorMessage = "Test error";
      BookRanking.find.mockRejectedValueOnce(new Error(errorMessage));

      await getBookRankingPreviousOfBook(req, res);

      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        statusCode: 500,
      });
    });
  });

  //   describe("updateTotalRead", () => {
  //     afterAll(async () => {
  //       await mongoose.connection.close();
  //     });
  //     it("should update total read when BookRanking.aggregate returns data", async () => {
  //       const bookId = "book123";
  //       const mockRankingData = [{ totalRead: 10 }];

  //       BookRanking.aggregate.mockResolvedValueOnce(mockRankingData);
  //       Book.updateOne.mockResolvedValueOnce({});

  //       await updateTotalRead(bookId);

  //       expect(BookRanking.aggregate).toHaveBeenCalledWith([
  //         { $match: { book_id: bookId } },
  //         { $group: { _id: null, totalRead: { $sum: "$totalRead" } } },
  //       ]);
  //       expect(Book.updateOne).toHaveBeenCalledWith(
  //         { _id: bookId },
  //         { totalRead: 10 }
  //       );
  //     });

  //     it("should set total read to 0 when BookRanking.aggregate returns no data", async () => {
  //       const bookId = "book123";
  //       const mockRankingData = [];

  //       BookRanking.aggregate.mockResolvedValueOnce(mockRankingData);
  //       Book.updateOne.mockResolvedValueOnce({});

  //       await updateTotalRead(bookId);

  //       expect(BookRanking.aggregate).toHaveBeenCalledWith([
  //         { $match: { book_id: bookId } },
  //         { $group: { _id: null, totalRead: { $sum: "$totalRead" } } },
  //       ]);
  //       expect(Book.updateOne).toHaveBeenCalledWith(
  //         { _id: bookId },
  //         { totalRead: 0 }
  //       );
  //     });

  //     it("should handle error when BookRanking.aggregate throws an error", async () => {
  //       const bookId = "book123";
  //       const errorMessage = "Test error";

  //       BookRanking.aggregate.mockRejectedValueOnce(new Error(errorMessage));

  //       const consoleSpy = jest
  //         .spyOn(console, "error")
  //         .mockImplementation(() => {});

  //       await updateTotalRead(bookId);

  //       expect(BookRanking.aggregate).toHaveBeenCalledWith([
  //         { $match: { book_id: bookId } },
  //         { $group: { _id: null, totalRead: { $sum: "$totalRead" } } },
  //       ]);
  //       expect(consoleSpy).toHaveBeenCalledWith(
  //         `Error updating totalRead: ${errorMessage}`
  //       );
  //       consoleSpy.mockRestore();
  //     });

  //     it("should handle error when Book.updateOne throws an error", async () => {
  //       const bookId = "book123";
  //       const mockRankingData = [{ totalRead: 10 }];
  //       const errorMessage = "Test error";

  //       BookRanking.aggregate.mockResolvedValueOnce(mockRankingData);
  //       Book.updateOne.mockRejectedValueOnce(new Error(errorMessage));

  //       const consoleSpy = jest
  //         .spyOn(console, "error")
  //         .mockImplementation(() => {});

  //       await updateTotalRead(bookId);

  //       expect(BookRanking.aggregate).toHaveBeenCalledWith([
  //         { $match: { book_id: bookId } },
  //         { $group: { _id: null, totalRead: { $sum: "$totalRead" } } },
  //       ]);
  //       expect(Book.updateOne).toHaveBeenCalledWith(
  //         { _id: bookId },
  //         { totalRead: 10 }
  //       );
  //       expect(consoleSpy).toHaveBeenCalledWith(
  //         `Error updating totalRead: ${errorMessage}`
  //       );
  //       consoleSpy.mockRestore();
  //     });
  //   });
});
