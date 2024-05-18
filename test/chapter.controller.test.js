const {
  addChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} = require("../controller/chapter.controller");
const Chapter = require("../model/chapter.model");
const Book = require("../model/book.model");

jest.mock("../model/chapter.model");
jest.mock("../model/book.model");

describe("Chapter Controller", () => {
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addChapter", () => {
    const req = {
      body: {
        book_id: "book123",
        name: "Chapter 1",
        audio: "audio.mp3",
      },
    };
    it("should add a chapter to an existing book", async () => {
      const existingBook = {
        _id: "book123",
        chapters: [],
        save: jest.fn(),
      };
      const savedChapter = {
        _id: "chapter123",
        name: "Chapter 1",
        audio: "audio.mp3",
      };

      Book.findById.mockResolvedValueOnce(existingBook);
      Chapter.prototype.save.mockResolvedValueOnce(savedChapter);

      await addChapter(req, res);

      expect(Book.findById).toHaveBeenCalledWith("book123");
      expect(existingBook.chapters).toContain("chapter123");
      expect(existingBook.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        chapter: savedChapter,
        statusCode: 200,
      });
    });

    it("should return 404 if the book does not exist", async () => {
      Book.findById.mockResolvedValueOnce(null);

      await addChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
    });

    it("should return 500 if an error occurs", async () => {
      Book.findById.mockRejectedValueOnce(new Error("Internal Server Error"));

      await addChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  describe("getAllChapters", () => {
    it("should return all chapters", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const chapters = [
        { name: "Chapter 1", audio: "audio1.mp3" },
        { name: "Chapter 2", audio: "audio2.mp3" },
      ];

      Chapter.find.mockResolvedValueOnce(chapters);

      await getAllChapters(req, res);

      expect(Chapter.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chapters);
    });

    it("should return 500 if an error occurs", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Chapter.find.mockRejectedValueOnce(new Error("Internal Server Error"));

      await getAllChapters(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateChapter", () => {
    it("should update an existing chapter", async () => {
      const req = {
        params: { chapterId: "chapter123" },
        body: { name: "Updated Chapter Name", audio: "updated_audio.mp3" },
      };
      const existingChapter = {
        _id: "chapter123",
        name: "Chapter 1",
        audio: "audio.mp3",
        save: jest.fn(),
      };
      const updatedChapter = {
        _id: "chapter123",
        name: "Updated Chapter Name",
        audio: "updated_audio.mp3",
      };

      Chapter.findById.mockResolvedValueOnce(existingChapter);
      existingChapter.save.mockResolvedValueOnce(updatedChapter);

      await updateChapter(req, res);

      expect(Chapter.findById).toHaveBeenCalledWith("chapter123");
      expect(existingChapter.name).toBe("Updated Chapter Name");
      expect(existingChapter.audio).toBe("updated_audio.mp3");
      expect(existingChapter.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedChapter);
    });

    it("should return 404 if the chapter does not exist", async () => {
      const req = {
        params: { chapterId: "nonexistentChapter" },
        body: { name: "Updated Chapter Name", audio: "updated_audio.mp3" },
      };
      Chapter.findById.mockResolvedValueOnce(null);

      await updateChapter(req, res);

      expect(Chapter.findById).toHaveBeenCalledWith("nonexistentChapter");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Chapter not found" });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        params: { chapterId: "chapter123" },
        body: { name: "Updated Chapter Name", audio: "updated_audio.mp3" },
      };
      Chapter.findById.mockRejectedValueOnce(
        new Error("Internal Server Error")
      );

      await updateChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteChapter", () => {
    it("should delete an existing chapter", async () => {
      const req = {
        params: { chapterId: "chapter123" },
      };
      const existingChapter = {
        _id: "chapter123",
        remove: jest.fn(),
      };

      Chapter.findById.mockResolvedValueOnce(existingChapter);

      await deleteChapter(req, res);

      expect(Chapter.findById).toHaveBeenCalledWith("chapter123");
      expect(existingChapter.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        message: "Chapter deleted successfully",
      });
    });

    it("should return 404 if the chapter does not exist", async () => {
      const req = {
        params: { chapterId: "nonexistentChapter" },
      };
      Chapter.findById.mockResolvedValueOnce(null);

      await deleteChapter(req, res);

      expect(Chapter.findById).toHaveBeenCalledWith("nonexistentChapter");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Chapter not found" });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        params: { chapterId: "chapter123" },
      };
      Chapter.findById.mockRejectedValueOnce(
        new Error("Internal Server Error")
      );

      await deleteChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
