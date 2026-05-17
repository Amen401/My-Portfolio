const TechLogo = require("../models/TechLogo");

// @desc    Get all tech logos (with optional search)
// @route   GET /api/tech-logos
const getTechLogos = async (req, res) => {
  try {
    const { search } = req.query;
    // If there's a search term, filter by name (case-insensitive)
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const logos = await TechLogo.find(query).sort({ createdAt: -1 });
    res.json(logos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a new tech logo
// @route   POST /api/tech-logos
const createTechLogo = async (req, res) => {
  try {
    const { name, logoUrl } = req.body;

    if (!name || !logoUrl) {
      return res.status(400).json({ message: "Name and logoUrl are required" });
    }

    const newLogo = await TechLogo.create({ name, logoUrl });
    res.status(201).json(newLogo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a tech logo
// @route   PUT /api/tech-logos/:id
const updateTechLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl } = req.body;

    const updatedLogo = await TechLogo.findByIdAndUpdate(
      id,
      { name, logoUrl },
      { new: true }, // Returns the updated document
    );

    if (!updatedLogo) {
      return res.status(404).json({ message: "Tech logo not found" });
    }

    res.json(updatedLogo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a tech logo
// @route   DELETE /api/tech-logos/:id
const deleteTechLogo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLogo = await TechLogo.findByIdAndDelete(id);

    if (!deletedLogo) {
      return res.status(404).json({ message: "Tech logo not found" });
    }

    res.json({ message: "Tech logo removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTechLogos,
  createTechLogo,
  updateTechLogo,
  deleteTechLogo,
};
