const {
  createTag,
  getAllTags,
  findOne,
  findById,
  updateTag,
  deleteTag,
} = require("../controller/tag.controller");
const Tag = require("../model/tag.model");

jest.mock("../model/tag.model");

describe("Tag Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("createTag", () => {
    it("should create a new tag successfully", async () => {
      req.body = { name: "New Tag", description: "Tag description" };

      Tag.findOne.mockResolvedValueOnce(null);
      Tag.prototype.save = jest.fn().mockResolvedValueOnce();

      await createTag(req, res);

      expect(Tag.findOne).toHaveBeenCalledWith({ name: req.body.name });
      expect(res.json).toHaveBeenCalledWith({
        message: "Tag added successfully!",
      });
    });

    it("should return 400 if name or description is missing", async () => {
      req.body = { name: "" };

      await createTag(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Name and description are required",
      });
    });

    it("should return message if tag already exists", async () => {
      req.body = { name: "Existing Tag", description: "Tag description" };

      Tag.findOne.mockResolvedValueOnce({ name: "Existing Tag" });

      await createTag(req, res);

      expect(Tag.findOne).toHaveBeenCalledWith({ name: req.body.name });
      expect(res.json).toHaveBeenCalledWith({ message: "Tag already exists" });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.body = { name: "New Tag", description: "Tag description" };

      Tag.findOne.mockRejectedValueOnce(new Error("Test error"));

      await createTag(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("getAllTags", () => {
    it("should get all tags successfully", async () => {
      const allTags = [{ name: "Tag1" }, { name: "Tag2" }];

      Tag.find.mockResolvedValueOnce(allTags);

      await getAllTags(req, res);

      expect(Tag.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ allTags });
    });

    it("should handle errors and return a 500 status code", async () => {
      Tag.find.mockRejectedValueOnce(new Error("Test error"));

      await getAllTags(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("findOne", () => {
    it("should find a tag by criteria successfully", async () => {
      const tag = { name: "Tag1" };

      req.body = { name: "Tag1" };
      Tag.findOne.mockResolvedValueOnce(tag);

      await findOne(req, res);

      expect(Tag.findOne).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ tag, statusCode: 200 });
    });
  });

  describe("findById", () => {
    it("should find a tag by ID successfully", async () => {
      const tagId = "123";
      const tag = { name: "Tag1" };

      req.params.id = tagId;
      Tag.findById.mockResolvedValueOnce(tag);

      await findById(req, res);

      expect(Tag.findById).toHaveBeenCalledWith(tagId);
      expect(res.json).toHaveBeenCalledWith({ tag, statusCode: 200 });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.params.id = "123";

      Tag.findById.mockRejectedValueOnce(new Error("Test error"));

      await findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });

  describe("updateTag", () => {
    it("should update a tag successfully", async () => {
      const tagId = "123";
      const tag = { _id: tagId, name: "Tag1", description: "Description1" };
      const updatedTag = {
        ...tag,
        name: "Updated Tag",
        description: "Updated Description",
      };

      req.params.id = tagId;
      req.body = { name: "Updated Tag", description: "Updated Description" };

      Tag.findById.mockResolvedValueOnce(tag);
      tag.save = jest.fn().mockResolvedValueOnce(updatedTag);

      await updateTag(req, res);

      expect(Tag.findById).toHaveBeenCalledWith(tagId);
      expect(tag.name).toBe("Updated Tag");
      expect(tag.description).toBe("Updated Description");
      expect(tag.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Tag updated successfully",
        updatedTag: tag,
      });
    });

    it("should return an error if name and description are missing", async () => {
      req.params.id = "123";
      req.body = {};

      await updateTag(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Name and description are required",
      });
    });

    it("should return an error if tag is not found", async () => {
      req.params.id = "123";
      req.body = { name: "Updated Tag", description: "Updated Description" };

      Tag.findById.mockResolvedValueOnce(null);

      await updateTag(req, res);

      expect(Tag.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({ message: "Tag not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.params.id = "123";
      req.body = { name: "Updated Tag", description: "Updated Description" };

      Tag.findById.mockRejectedValueOnce(new Error("Test error"));

      await updateTag(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteTag", () => {
    it("should delete a tag successfully", async () => {
      const tagId = "123";
      const tag = { _id: tagId, name: "Tag1", description: "Description1" };

      req.params.id = tagId;
      Tag.findByIdAndDelete.mockResolvedValueOnce(tag);

      await deleteTag(req, res);

      expect(Tag.findByIdAndDelete).toHaveBeenCalledWith(tagId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tag deleted successfully",
        deletedTag: tag,
      });
    });

    it("should return a 404 if tag is not found", async () => {
      req.params.id = "123";

      Tag.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteTag(req, res);

      expect(Tag.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tag not found" });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.params.id = "123";

      Tag.findByIdAndDelete.mockRejectedValueOnce(new Error("Test error"));

      await deleteTag(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
