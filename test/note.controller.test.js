const Note = require("../model/note.model");
const {
  createNote,
  getNotesForBookByUser,
  updateNote,
  deleteNote,
} = require("../controller/note.controller");

// Mocking the Note model
jest.mock("../model/note.model");

describe("Note Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createNote", () => {
    it("should create a new note and return it with a 200 status code", async () => {
      const mockNote = {
        _id: "noteId123",
        content: "Test note",
      };

      req.body = mockNote;

      Note.prototype.save = jest.fn().mockResolvedValue(mockNote);

      await createNote(req, res);

      expect(Note).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        note: mockNote,
        statusCode: 200,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      Note.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "error",
        message: errorMessage,
      });
    });
  });

  describe("getNotesForBookByUser", () => {
    it("should return all notes for a specific book by a specific user", async () => {
      const mockNotes = [
        { _id: "noteId1", content: "Note 1" },
        { _id: "noteId2", content: "Note 2" },
      ];

      req.params.book_id = "bookId123";
      req.params.user_id = "userId123";

      Note.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(mockNotes),
      });

      await getNotesForBookByUser(req, res);

      expect(Note.find).toHaveBeenCalledWith({
        user: req.params.user_id,
        book: req.params.book_id,
      });
      expect(res.json).toHaveBeenCalledWith({
        notes: mockNotes,
        statusCode: 200,
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.book_id = "bookId123";
      req.params.user_id = "userId123";

      Note.find.mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      });

      await getNotesForBookByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });

    it("should return 404 if no notes found", async () => {
      req.params.book_id = "bookId123";
      req.params.user_id = "userId123";

      Note.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(null),
      });

      await getNotesForBookByUser(req, res);

      expect(Note.find).toHaveBeenCalledWith({
        user: req.params.user_id,
        book: req.params.book_id,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Không có ghi chú trước đó",
        statusCode: 404,
      });
    });
  });

  describe("updateNote", () => {
    it("should update an existing note and return it with a 200 status code", async () => {
      const noteId = "noteId123";
      const mockNote = {
        _id: noteId,
        title: "Old title",
        page: 1,
        content: "Old content",
        save: jest.fn().mockResolvedValue({
          _id: noteId,
          title: "New title",
          page: 2,
          content: "New content",
        }),
      };

      req.params.noteId = noteId;
      req.body = { title: "New title", page: 2, content: "New content" };

      Note.findById.mockResolvedValue(mockNote);

      await updateNote(req, res);

      expect(Note.findById).toHaveBeenCalledWith(noteId);
      expect(mockNote.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Note updated successfully",
        updatedNote: mockNote,
      });
    });

    it("should return a 404 status code if the note is not found", async () => {
      req.params.noteId = "nonexistentNoteId";
      Note.findById.mockResolvedValue(null);

      await updateNote(req, res);

      expect(Note.findById).toHaveBeenCalledWith(req.params.noteId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.noteId = "noteId123";
      Note.findById.mockRejectedValue(new Error(errorMessage));

      await updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteNote", () => {
    it("should delete an existing note and return a 200 status code", async () => {
      const noteId = "noteId123";
      const mockNote = { _id: noteId };

      req.params.noteId = noteId;
      Note.findByIdAndRemove = jest.fn().mockResolvedValue(mockNote);

      await deleteNote(req, res);

      expect(Note.findByIdAndRemove).toHaveBeenCalledWith(noteId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Note deleted successfully",
        deletedNote: mockNote,
      });
    });

    it("should return a 404 status code if the note is not found", async () => {
      req.params.noteId = "nonexistentNoteId";
      Note.findByIdAndRemove = jest.fn().mockResolvedValue(null);

      await deleteNote(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      const errorMessage = "Test error";
      req.params.noteId = "noteId123";
      Note.findByIdAndRemove = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await deleteNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
