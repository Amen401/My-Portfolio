const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    bio: { type: String, required: true },
    profession: { type: String, required: true },
    description: { type: String, required: true },
    profilePic: String,
    cvUrl: String,
    linkedin: String,
    github: String,
    website: String,
    address: String,
    phone: String,
    yearsOfExperience: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will store this hashed
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
