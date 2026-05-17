const Message = require("../models/Message");
const {
  sendNotificationEmail,
  sendReplyEmail,
} = require("../services/emailService");

const getMessages = async (req, res) => {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const messages = await Message.find(query).sort({ createdAt: -1 });
  res.json(messages);
};

const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    await sendNotificationEmail(name, email, message);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Mark as read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Toggle Ignore
const toggleIgnore = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.isIgnored = !message.isIgnored;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Reply to message
const replyToMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    // Send the actual email
    await sendReplyEmail(message.email, message.message, replyText);

    // Update the database
    message.replyText = replyText;
    message.repliedAt = new Date();
    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
  markAsRead,
  toggleIgnore,
  replyToMessage,
};
