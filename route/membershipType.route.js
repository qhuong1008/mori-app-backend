const express = require("express");
const router = express.Router();
const membershipTypeController = require("../controller/membershipType.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

// Routes for membership types
router.post("/membership-types", membershipTypeController.createMembershipType);
router.get("/membership-types", membershipTypeController.findAll);
router.get("/membership-types/:id", membershipTypeController.findOne);
router.put("/membership-types/:id", membershipTypeController.update);
router.delete("/membership-types/:id", membershipTypeController.delete);

module.exports = router;