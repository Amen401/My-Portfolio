const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getProjects);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
