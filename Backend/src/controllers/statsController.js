const Project = require("../models/Project");
const Message = require("../models/Message");
const TechLogo = require("../models/TechLogo");

// @desc    Get dashboard metrics
// @route   GET /api/stats
const getStats = async (req, res) => {
  try {
    const projectCount = await Project.countDocuments();
    const messageCount = await Message.countDocuments({ isRead: false });
    const techCount = await TechLogo.countDocuments();

    res.json({
      projects: projectCount,
      unreadMessages: messageCount,
      techStack: techCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

module.exports = { getStats };
