const express = require("express");
const router = express.Router();
const cors = require("cors");
const account = require("../controller/account.controller");
const recommend = require("../controller/recommendation.controller");

router.get("/get-account", account.findAll);
router.put(
  "/update-membership-status/:accountId",
  account.updateMembershipStatus
);
router.get("/email", account.findByEmail);
router.patch("/:id", account.update);
router.get("/get-account/:id", account.findById);
router.post("/add-account", account.createNewAccount);
router.post("/add-manual-account", account.createManualAccount);
router.post("/find-account", account.findOne);
router.post("/change-password", account.changePassword);

router.post(
  "/add-recommendations",
  recommend.createOrUpdateUserRecommendations
);
router.post("/addAll-recommendations", recommend.createAllUserRecommendations);
router.get("/get-recommendations/:id", recommend.getUserRecommendations);

// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;
router.get("/profile", isAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
