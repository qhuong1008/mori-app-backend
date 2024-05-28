const accountController = require("../controller/account.controller");
const Account = require("../model/account.model");
const bcrypt = require("bcrypt");

jest.mock("../model/account.model");

describe("checkCreateByUsername-accountController", () => {
  const user = { username: "nguyenlien", email: "test@example.com" };
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 2 when the username and email already exist in the database", async () => {
    Account.findOne.mockResolvedValueOnce({
      username: "nguyenlien",
      email: "test@example.com",
    });

    const result = await accountController.checkCreateByUsername(user);
    expect(result).toBe(2);
  });

  test("should return 1 when the username and email do not exist in the database", async () => {
    Account.findOne.mockResolvedValueOnce(null);

    const result = await accountController.checkCreateByUsername(user);
    expect(result).toBe(1);
  });

  test("should return an error object when an error occurs", async () => {
    Account.findOne.mockRejectedValueOnce(new Error("Database error"));

    const result = await accountController.checkCreateByUsername(user);
    expect(result).toEqual(new Error("Database error"));
  });

  test("should call Account.findOne with the correct query", async () => {
    await accountController.checkCreateByUsername(user);

    expect(Account.findOne).toHaveBeenCalledWith({
      $or: [{ username: "nguyenlien" }, { email: "test@example.com" }],
    });
  });
});

//////////// Change Password /////////////////
jest.mock("bcrypt");
describe("changePassword-accountController", () => {
  const user = {
    username: "testUser",
    password: "password123",
    save: jest.fn(),
  };
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("Change password with valid user and correct current password", async () => {
    Account.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    user.save.mockResolvedValue(user);
    bcrypt.hash.mockResolvedValue("newHashedPassword123");

    const req = {
      body: {
        username: "testUser",
        currentPassword: "password123",
        newPassword: "newPassword123",
      },
    };
    await accountController.changePassword(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "password123");
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật mật khẩu thành công",
    });
  });

  test("Change password with valid user but incorrect current password", async () => {
    Account.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        username: "testUser",
        currentPassword: "wrongPassword",
        newPassword: "newPassword456",
      },
    };
    await accountController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "error",
      message: "Mật khẩu cũ không hợp lệ",
    });
  });
  test("Change password with non-existent user", async () => {
    Account.findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: "testUser",
        currentPassword: "password123",
        newPassword: "newPassword123",
      },
    };
    await accountController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "error",
      message: "Tài khoản không tồn tại",
    });
  });

  test("Change password with an error", async () => {
    Account.findOne.mockRejectedValue(new Error("Database error"));

    const req = {
      body: {
        username: "testUser",
        currentPassword: "password123",
        newPassword: "newPassword123",
      },
    };
    await accountController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "error",
      message: "Database error",
    });
  });
});
