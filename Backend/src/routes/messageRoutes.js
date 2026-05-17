const express = require("express");
const router = express.Router();
const {
  getMessages,
  createMessage,
  markAsRead,
  toggleIgnore,
  replyToMessage,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getMessages);
router.post("/", createMessage);

// NEW ROUTES
router.put("/:id/read", protect, markAsRead);
router.put("/:id/ignore", protect, toggleIgnore);
router.post("/:id/reply", protect, replyToMessage);

module.exports = router;
