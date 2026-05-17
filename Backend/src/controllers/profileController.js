const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCoreIdentity = async (req, res) => {
  const { fullName, profession, yearsOfExperience, address, profilePic } =
    req.body;
  const profile = await Profile.findOneAndUpdate(
    {},
    { fullName, profession, yearsOfExperience, address, profilePic },
    { new: true },
  );
  res.json(profile);
};

const updateNarratives = async (req, res) => {
  const { bio, description } = req.body;
  const profile = await Profile.findOneAndUpdate(
    {},
    { bio, description },
    { new: true },
  );
  res.json(profile);
};

const updateConnections = async (req, res) => {
  const { phone, website, linkedin, github } = req.body;
  const profile = await Profile.findOneAndUpdate(
    {},
    { phone, website, linkedin, github },
    { new: true },
  );
  res.json(profile);
};

const updateCredentials = async (req, res) => {
  try {
    const { username, password, currentPassword } = req.body;

    // 1. Find profile
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, profile.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid current password" });

    // 3. Hash new password MANUALLY
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Update profile fields
    profile.username = username;
    profile.password = hashedPassword;

    // 5. Save without triggering middleware
    await profile.save();

    res.json({ message: "Credentials updated successfully" });
  } catch (err) {
    console.error(err); // Check your backend terminal for this log
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateCoreIdentity,
  updateNarratives,
  updateConnections,
  updateCredentials,
};
