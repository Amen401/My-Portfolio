const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateCoreIdentity,
  updateNarratives,
  updateConnections,
  updateCredentials,
} = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getProfile);
router.put("/identity", protect, updateCoreIdentity);
router.put("/narratives", protect, updateNarratives);
router.put("/connections", protect, updateConnections);
router.put("/credentials", protect, updateCredentials);

module.exports = router;
