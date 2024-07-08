// Import dependencies
const authController = require("../auth/auth.controller");
const accountController = require("../controller/account.controller");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Mock accountController module
jest.mock("../controller/account.controller", () => ({
  checkCreateByUsername: jest.fn(),
  findByUsername: jest.fn(),
  isGoogleAccountExist: jest.fn(),

  getGoogleAccount: jest.fn(),
  createNewAccount: jest.fn(),
}));

// Mock nodemailer.createTransport
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

// Mock jwt.sign
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("register-authContronller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "exampleUser",
        password: "password",
        displayName: "Example User",
        email: "bichlienja@gmail.com",
      },
      protocol: "http",
      get: jest.fn().mockReturnValue("localhost:3000"),
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    nodemailer.createTransport.mockClear();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  // it("should return error when createUser returns 1 and sending email fails", async () => {
  //   const expectedErrorMessage = "Failed to send verify email";

  //   // Mocking checkCreateByUsername to return 1
  //   accountController.checkCreateByUsername.mockReturnValue(1);

  //   // Mocking jwt.sign
  //   jwt.sign.mockReturnValue("exampleToken");

  //   // Mocking transporter.sendMail to throw an error
  //   nodemailer.createTransport.mockReturnValue({
  //     sendMail: jest
  //       .fn()
  //       .mockRejectedValueOnce(new Error("Failed to send verify email")),
  //   });

  //   // Call the function
  //   await authController.registerAccount(req, res);

  //   // Check if status 500 is sent with the expected error message
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: expectedErrorMessage });
  // });

  it("should return error when createUser returns 2 (username or email exists)", async () => {
    const expectedError = {
      error: "error",
      message: "Username or email has already existed!",
    };

    // Mocking checkCreateByUsername to return 2
    accountController.checkCreateByUsername.mockReturnValue(2);

    // Call the function
    await authController.registerAccount(req, res);

    // Check if the expected error message is sent
    expect(res.json).toHaveBeenCalledWith(expectedError);
  });

  it("should return error when createUser returns an unexpected value", async () => {
    const unexpectedError = {
      error: "error",
      message: "Unexpected error message",
    };

    // Mocking checkCreateByUsername to return an unexpected value
    accountController.checkCreateByUsername.mockResolvedValue(unexpectedError);

    // Call the function
    await authController.registerAccount(req, res);

    // Check if the unexpected error message is sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(unexpectedError);
  });

  it("should return success message and tokenVerify when createUser returns 1 and email is sent successfully", async () => {
    const expectedToken = "exampleToken";
    const expectedResponse = {
      username: "exampleUser",
      message: "Account created successfully",
      tokenVerify: expectedToken,
    };

    // Mocking checkCreateByUsername to return 1
    accountController.checkCreateByUsername.mockReturnValue(1);

    // Mocking jwt.sign
    jwt.sign.mockReturnValue(expectedToken);

    // Mocking sendMail function
    const sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    // Call the function
    await authController.registerAccount(req, res);

    // Check if success message and tokenVerify are sent
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});

////////    LOGIN   ////////////////////////////////
describe("login-authController", () => {
  let req, res;

  const user = {
    _id: "user_id",
    email: "example@gmail.com",
    displayName: "John Doe",
    avatar: "avatar.jpg",
    is_active: true,
    username: "johndoe",
  };

  googleAccount = {
    email: "example@gmail.com",
    name: "John Doe",
    picture: "avatar.jpg",
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test("should login with Google account if account exists", async () => {
    const req = {
      body: {
        googleAccount,
      },
    };

    // Mock isGoogleAccountExist to return true
    accountController.isGoogleAccountExist.mockResolvedValue(true);
    // Mock getGoogleAccount to return a user
    accountController.getGoogleAccount.mockResolvedValue(user);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user,
      message: "Đăng nhập thành công!",
    });
  });

  test("should create new account with Google account if account does not exist", async () => {
    const req = {
      body: {
        googleAccount,
      },
    };

    // Mock isGoogleAccountExist to return false
    accountController.isGoogleAccountExist.mockResolvedValue(false);

    // Mock createNewAccount to return a new user
    const newUser = user;
    accountController.createNewAccount.mockResolvedValue(newUser);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user,
      message: "Đăng nhập thành công!",
    });
  });

  test("should handle manual account login", async () => {
    const req = {
      body: {
        username: "johndoe",
        password: "password",
      },
    };

    // Mock manualLogin to return a user
    authController.manualLogin = jest.fn().mockResolvedValue({
      user,
    });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user,
      message: "Đăng nhập thành công!",
    });
  });

  test("should return error for blocked account", async () => {
    const req = {
      body: {
        user_is_blocked: {
          _id: "user_id",
          email: "example@gmail.com",
          displayName: "John Doe",
          avatar: "avatar.jpg",
          is_blocked: true,
          username: "johndoe",
        },
      },
    };

    // Mock manualLogin to return a user
    authController.manualLogin = jest.fn().mockResolvedValue({
      user_is_blocked: {
        _id: "user_id",
        email: "example@gmail.com",
        displayName: "John Doe",
        avatar: "avatar.jpg",
        is_blocked: true,
        username: "johndoe",
      },
    });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: "Đăng nhập thất bại! Vui lòng thử lại",
    });
  });

  test("should return error for invalid credentials", async () => {
    const req = {
      body: {
        username: "johndoe",
        password: "wrong_password",
      },
    };

    // Mock manualLogin to return an error
    authController.manualLogin = jest.fn().mockResolvedValue({
      error: "Invalid credentials",
    });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("should handle login failure", async () => {
    const req = {
      body: {
        googleAccount,
      },
    };

    // Mock isGoogleAccountExist to return false
    accountController.isGoogleAccountExist.mockResolvedValue(false);

    // Mock createNewAccount to throw an error
    accountController.createNewAccount.mockRejectedValue(
      new Error("Create account failed")
    );

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: "Đăng nhập thất bại! Vui lòng thử lại",
    });
  });
});

///////////////////////  MANUAL LOGIN //////////////////////
// describe("manualLogin", () => {
//   let usernameReq, passwordReq;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     usernameReq = "exampleUser";
//     passwordReq = "password";
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//     jest.resetAllMocks();
//     jest.restoreAllMocks();
//   });

//   it("should return error if user is not found", async () => {
//     const expectedErrorMessage = "Thông tin đăng nhập không đúng!";
//     accountController.findByUsername.mockResolvedValue(null);

//     const result = await authController.manualLogin(usernameReq, passwordReq);

//     expect(accountController.findByUsername).toHaveBeenCalledWith(
//       usernameReq.toLowerCase()
//     );
//     expect(result).toEqual({ error: expectedErrorMessage });
//   });

//   it("should return error if email is not verified", async () => {
//     const user = {
//       username: "exampleUser",
//       is_verify_email: false,
//       email: "example@example.com",
//     };
//     accountController.findByUsername.mockResolvedValue(user);

//     const expectedErrorMessage = `Bạn chưa xác thực mail tạo tài khoản, vui lòng kiểm tra mail ${user.email}`;

//     const result = await authController.manualLogin(usernameReq, passwordReq);

//     expect(accountController.findByUsername).toHaveBeenCalledWith(
//       usernameReq.toLowerCase()
//     );
//     expect(result).toEqual({ error: expectedErrorMessage });
//   });

//   it("should return error if password is incorrect", async () => {
//     const user = {
//       username: "exampleUser",
//       is_verify_email: true,
//       email: "example@example.com",
//       password: "hashedPassword", // Assume the hashed password
//     };
//     accountController.findByUsername.mockResolvedValue(user);
//     bcrypt.compare.mockReturnValue(false); // Password comparison fails

//     const expectedErrorMessage = "Thông tin đăng nhập không đúng!";

//     const result = await authController.manualLogin(usernameReq, passwordReq);

//     expect(accountController.findByUsername).toHaveBeenCalledWith(
//       usernameReq.toLowerCase()
//     );
//     expect(result).toEqual({ error: expectedErrorMessage });
//   });

//   it("should return user object if login is successful", async () => {
//     const user = {
//       _id: "user_id",
//       username: "exampleUser",
//       is_verify_email: true,
//       email: "example@example.com",
//       password: "hashedPassword", // Assume the hashed password
//     };
//     accountController.findByUsername.mockResolvedValue(user);
//     bcrypt.compare.mockReturnValue(true); // Password comparison succeeds

//     const result = await authController.manualLogin(usernameReq, passwordReq);

//     expect(accountController.findByUsername).toHaveBeenCalledWith(
//       usernameReq.toLowerCase()
//     );
//     expect(result).toEqual({ user });
//   });
// });
