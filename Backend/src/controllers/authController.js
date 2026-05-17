const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const profile = await Profile.findOne({ username });
    if (!profile)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: profile._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.json({
      token,
      user: { email: profile.username, name: profile.fullName },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
