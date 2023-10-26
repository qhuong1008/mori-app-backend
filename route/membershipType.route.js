const express = require("express");
const router = express.Router();
const cors = require("cors");
const membershipTypeController = require("../controller/membershipType.controller");

// Enable CORS
//router.use(cors());

// Routes for membership types
router.post("/membership-types", cors(), membershipTypeController.createMembershipType);
router.get("/membership-types", cors(), membershipTypeController.findAll);
router.get("/membership-types/:id", cors(), membershipTypeController.findOne);
router.put("/membership-types/:id", cors(), membershipTypeController.update);
router.delete("/membership-types/:id", cors(), membershipTypeController.delete);

module.exports = router;