const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Planned"],
      default: "In Progress",
    },
    githubLink: String,
    liveLink: String,
    problem: String,
    solution: String,
    features: [String],
    imageUrl: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
