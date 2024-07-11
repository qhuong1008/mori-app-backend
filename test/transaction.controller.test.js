const {
  create,
  getUserTrans,
  getAllTransactions,
} = require("../controller/transaction.controller");
const Transaction = require("../model/transaction.model");
const userVoucherController = require("../controller/userVoucher.controller");

jest.mock("../model/transaction.model");
jest.mock("../controller/userVoucher.controller");

describe("Transaction Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new transaction successfully", async () => {
      req.body = {
        account: "account123",
        product: "product123",
        userVoucher: "voucher123",
      };

      // Mock the Transaction model and userVoucherController methods
      Transaction.findOne.mockResolvedValueOnce(null);
      const mockSave = jest.fn().mockResolvedValueOnce(req.body);
      Transaction.prototype.save = mockSave;
      userVoucherController.updateUserVoucherUsedStatus = jest
        .fn()
        .mockResolvedValueOnce({});
      const checkUserLoyaltyThenGiveNewVoucher = jest.fn();

      // Mock the method checkUserLoyaltyThenGiveNewVoucher if it belongs to the current module
      create.checkUserLoyaltyThenGiveNewVoucher =
        checkUserLoyaltyThenGiveNewVoucher;

      await create(req, res);

      expect(Transaction.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith({
      //   transaction: req.body,
      //   statusCode: 200,
      // });
    });

    it("should return 400 if transaction already exists", async () => {
      req.body = { account: "account123", product: "product123" };

      Transaction.findOne.mockResolvedValueOnce(req.body);

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sản phẩm này đã được mua trước đó",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.body = { account: "account123", product: "product123" };

      Transaction.findOne.mockResolvedValueOnce(null);
      Transaction.prototype.save = jest
        .fn()
        .mockRejectedValueOnce(new Error("Test error"));

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getUserTrans", () => {
    it("should get user transactions successfully", async () => {
      req.query = { account: "account123", type: "productType123" };

      const transactions = [{ product: "product1" }, { product: "product2" }];
      const mockExec = jest.fn().mockResolvedValueOnce(transactions);
      const mockPopulate = jest.fn().mockReturnThis();
      Transaction.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });
      //   Transaction.find.mockResolvedValueOnce(transactions);

      await getUserTrans(req, res);

      expect(Transaction.find).toHaveBeenCalledWith({
        account: req.query.account,
        productType: req.query.type,
      });
      expect(res.json).toHaveBeenCalledWith({ transactions, statusCode: 200 });
    });

    it("should return 400 if account or type is missing", async () => {
      req.query = { account: "account123" };

      await getUserTrans(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing account or type parameter",
      });
    });

    it("should handle errors and return a 500 status code", async () => {
      req.query = { account: "account123", type: "productType123" };
      const errorMessage = "Test error";
      const mockPopulate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      Transaction.find.mockReturnValueOnce({ populate: mockPopulate });
      mockPopulate.mockReturnValueOnce({ exec: mockExec });
      //   Transaction.find.mockRejectedValueOnce(new Error("Test error"));

      await getUserTrans(req, res);

      expect(Transaction.find).toHaveBeenCalledWith({
        account: req.query.account,
        productType: req.query.type,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: "Server error" });
    });
  });

  describe("getAllTransactions", () => {
    it("should get all transactions successfully", async () => {
      const transactions = [
        { account: "account1", productType: "type1" },
        { account: "account2", productType: "type2" },
      ];
      const mockExec = jest.fn().mockResolvedValueOnce(transactions);
      const mockPopulate = jest.fn().mockReturnThis();
      Transaction.find.mockReturnValue({
        populate: mockPopulate,
        exec: mockExec,
      });

      await getAllTransactions(req, res);

      expect(Transaction.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        data: transactions,
        statusCode: 200,
      });
    });
  });
});
