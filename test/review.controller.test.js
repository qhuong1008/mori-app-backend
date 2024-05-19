const Review = require("../model/review.model");
const Account = require("../model/account.model");
const {
  ratingBook,
  reviewBook,
  getRatingsByBook,
  getReviewsByBook,
  updateReview,
  deleteReview,
} = require("../controller/review.controller");

jest.mock("../model/review.model");
jest.mock("../model/account.model");

describe("Review Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("ratingBook", () => {
    it("should return 400 if user has already rated the book", async () => {
      const existingRating = { content: null };
      Review.findOne.mockResolvedValueOnce(existingRating);

      req.body.book_id = "book123";
      req.body.user_id = "user123";
      req.body.rating = 5;

      await ratingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "You have already rated this book.",
      });
    });

    it("should add a new rating successfully", async () => {
      Review.findOne.mockResolvedValueOnce(null);
      Account.findById.mockResolvedValueOnce({});

      req.body.book_id = "book123";
      req.body.user_id = "user123";
      req.body.rating = 4;

      await ratingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        rating: 4,
        message: "Rating added successfully!",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      Review.findOne.mockRejectedValueOnce(new Error("Test error"));

      await ratingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong!" });
    });
  });

  describe("reviewBook", () => {
    it("should return 400 if content is missing", async () => {
      req.body.book_id = "book123";
      req.body.user_id = "user123";
      req.body.rating = 4;
      req.body.content = ""; // Missing content

      await reviewBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please enter comment content.",
      });
    });

    it("should add a new review successfully", async () => {
      const savedReview = { content: "Great book!" };
      Review.prototype.save.mockResolvedValueOnce(savedReview);

      req.body.book_id = "book123";
      req.body.user_id = "user123";
      req.body.rating = 4;
      req.body.content = "Great book!";

      await reviewBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        newReview: savedReview,
        message: "Comment and rating added successfully!",
      });
    });
  });

  describe("getRatingsByBook", () => {
    it("should return the total reviews and average rating", async () => {
      const bookId = "book123";
      const totalReviews = 5;
      const totalRating = [{ totalRating: 20 }];
      const averageRating = 4;

      Review.countDocuments.mockResolvedValueOnce(totalReviews);
      Review.aggregate.mockResolvedValueOnce(totalRating);

      req.params.id = bookId;

      await getRatingsByBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalReviews: totalReviews,
        averageRating: averageRating,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      Review.countDocuments.mockRejectedValueOnce(new Error("Test error"));

      await getRatingsByBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: "Test error",
      });
    });
  });

  describe("getReviewsByBook", () => {
    it("should return reviews for the specified book", async () => {
      const bookId = "book123";
      const reviews = [
        { content: "Great book!" },
        { content: "Awesome read!" },
      ];
      const mockExec = jest.fn().mockResolvedValueOnce(reviews);
      const mockPopulate = jest.fn().mockReturnThis();
      Review.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      req.params.id = bookId;

      await getReviewsByBook(req, res);

      expect(res.json).toHaveBeenCalledWith({
        reviews: reviews,
        statusCode: 200,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      Review.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });

      await getReviewsByBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error(errorMessage) });
    });
  });

  describe("updateReview", () => {
    it("should update the review content successfully", async () => {
      const reviewId = "review123";
      const newContent = "Updated review content";
      const existingReview = {
        _id: reviewId,
        content: "Old content",
        save: jest.fn(),
      };

      Review.findOne.mockResolvedValueOnce(existingReview);

      req.params.id = reviewId;
      req.body.content = newContent;

      await updateReview(req, res);

      expect(Review.findOne).toHaveBeenCalledWith({ _id: reviewId });
      expect(existingReview.content).toBe(newContent);
      expect(existingReview.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Comment updated successfully!",
      });
    });

    it("should return 404 if review is not found", async () => {
      Review.findOne.mockResolvedValueOnce(null);

      req.params.id = "nonExistentReviewId";

      await updateReview(req, res);

      expect(Review.findOne).toHaveBeenCalledWith({ _id: req.params.id });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found." });
    });

    it("should return 400 if content is not provided", async () => {
      const reviewId = "review123";
      const existingReview = {
        _id: reviewId,
        content: "Old content",
        save: jest.fn(),
      };

      Review.findOne.mockResolvedValueOnce(existingReview);

      req.params.id = reviewId;
      req.body.content = "";

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please enter comment content.",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      Review.findOne.mockRejectedValueOnce(new Error("Test error"));

      await updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong!" });
    });
  });

  describe("deleteReview", () => {
    it("should delete the review successfully", async () => {
      const reviewId = "review123";
      const deletedReview = { _id: reviewId };

      Review.findByIdAndDelete.mockResolvedValueOnce(deletedReview);

      req.params.id = reviewId;

      await deleteReview(req, res);

      expect(Review.findByIdAndDelete).toHaveBeenCalledWith(reviewId);
      expect(res.json).toHaveBeenCalledWith({
        message: "Review deleted successfully.",
        statusCode: 200,
      });
    });

    it("should return 404 if review is not found", async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce(null);

      req.params.id = "nonExistentReviewId";

      await deleteReview(req, res);

      expect(Review.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({
        message: "Review not found.",
        statusCode: 404,
      });
    });

    it("should handle errors and return a 400 status code", async () => {
      Review.findByIdAndDelete.mockRejectedValueOnce(new Error("Test error"));

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong!" });
    });
  });
});
