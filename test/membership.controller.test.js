const {
  create,
  findAll,
  findById,
} = require("../controller/membership.controller");
const Membership = require("../model/membership.model");

jest.mock("../model/membership.model");

describe("Membership Controller", () => {
  beforeEach(() => {
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const req = { body: { user: "userId123", otherData: "otherData" } };
    it("should create new membership if not exist", async () => {
      const mockMembership = null;
      Membership.findOne.mockResolvedValueOnce(mockMembership);
      Membership.prototype.save = jest.fn().mockResolvedValueOnce();

      await create(req, res);

      expect(Membership.findOne).toHaveBeenCalledWith({ user: "userId123" });
      expect(Membership.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "membership added successfully!",
      });
    });

    it('should not create new membership if already exists and is still valid', async () => {
      const mockMembership = { user: 'userId123', outdated_on: new Date(Date.now() + 1000 * 60 * 60 * 24) }; // Outdated date in the future
      Membership.findOne.mockResolvedValueOnce(mockMembership);
  
      await create(req, res);
  
      expect(Membership.findOne).toHaveBeenCalledWith({ user: 'userId123' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Đăng kí gói cước thất bại, vui lòng sử dụng hết gói cước đã đăng kí!'
      });
    });
  });

  describe("findAll", () => {
    it("should find all memberships", async () => {
      const req = {};
      const mockMemberships = [
        { _id: "membershipId1", user: "userId1" },
        { _id: "membershipId2", user: "userId2" },
      ];
      Membership.find.mockResolvedValueOnce(mockMemberships);

      await findAll(req, res);

      expect(Membership.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        memberships: mockMemberships,
        statusCode: 200,
      });
    });
  });

  describe("findById", () => {
    it("should find membership by user ID", async () => {
      const req = { params: { id: "userId123" } };
      const mockMembership = { _id: "membershipId123", user: "userId123" };
      Membership.findOne.mockResolvedValueOnce(mockMembership);

      await findById(req, res);

      expect(Membership.findOne).toHaveBeenCalledWith({ user: "userId123" });
      expect(res.json).toHaveBeenCalledWith({
        membership: mockMembership
      });
    });

    it("should handle errors", async () => {
      const req = { params: { id: "userId123" } };
      const errorMessage = "An error occurred";
      Membership.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });
});
