const express = require("express");
const router = express.Router();
const {
  getTechLogos,
  createTechLogo,
  updateTechLogo,
  deleteTechLogo,
} = require("../controllers/techController");
const { protect } = require("../middlewares/authMiddleware");

// Public route: Anyone can view the logos on the homepage
router.get("/", getTechLogos);

// Protected routes: Only admin can modify them
router.post("/", protect, createTechLogo);
router.put("/:id", protect, updateTechLogo);
router.delete("/:id", protect, deleteTechLogo);

module.exports = router;
