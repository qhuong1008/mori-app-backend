const {
  createMembershipType,
  findAll,
  findOne,
} = require("../controller/membershipType.controller");
const MembershipType = require("../model/membershipType.model");

jest.mock("../model/membershipType.model");

describe("Membership Type Controller", () => {
  beforeEach(() => {
    res = {
      json: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createMembershipType", () => {
    it("should create a new membership type", async () => {
      const req = {
        body: { name: "Gold", duration: "1 year", price: 100 },
      };
      MembershipType.findOne.mockResolvedValueOnce(null);
      MembershipType.prototype.save.mockResolvedValueOnce();

      await createMembershipType(req, res);

      expect(res.json).toHaveBeenCalledWith(
        "Membership type added successfully!"
      );
    });

    it("should return message if membership type already exists", async () => {
      const req = {
        body: { name: "Gold", duration: "1 year", price: 100 },
      };
      MembershipType.findOne.mockResolvedValueOnce({});

      await createMembershipType(req, res);

      expect(res.json).toHaveBeenCalledWith("Membership type already exists!");
    });
  });

  describe("findAll", () => {
    it("should return all membership types", async () => {
      const req = {};
      const mockMembershipTypes = [
        { name: "Gold", duration: "1 year", price: 100 },
        { name: "Silver", duration: "6 months", price: 50 },
      ];

      MembershipType.find.mockResolvedValueOnce(mockMembershipTypes);

      await findAll(req, res);

      expect(MembershipType.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        membershipTypes: mockMembershipTypes,
        statusCode: 200,
      });
    });
  });

  describe("findOne", () => {
    it("should return a membership type", async () => {
      const req = {
        body: { name: "Gold" },
      };
      const mockMembershipType = {
        name: "Gold",
        duration: "1 year",
        price: 100,
      };

      MembershipType.findOne.mockResolvedValueOnce(mockMembershipType);

      await findOne(req, res);

      expect(MembershipType.findOne).toHaveBeenCalledWith({ name: "Gold" });
      expect(res.json).toHaveBeenCalledWith({
        membershipType: mockMembershipType,
        statusCode: 200,
      });
    });
  });
});
