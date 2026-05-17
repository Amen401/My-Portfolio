require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Profile = require("./models/Profile");

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Database connected.");

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("paul1995", salt);

    const adminData = {
      fullName: "Pawlos Gelgelo",
      username: "pawlosgelgelo@gmail.com",
      password: hashedPassword, // Using the pre-hashed password
      bio: "Software Engineer dedicated to building impactful digital experiences.",
      profession: "Software Engineer",
      description: "System admin",
      profilePic:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      cvUrl: "#",
      linkedin: "#",
      telegram: "#",
      github: "#",
      website: "#",
      address: "Addis Ababa, Ethiopia",
      phone: "+251 900 000 000",
      yearsOfExperience: "3+",
    };

    await Profile.deleteMany({});
    await Profile.create(adminData);

    console.log("✅ Admin account created successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

seedDatabase();
