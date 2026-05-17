const Project = require("../models/Project");

// GET /api/projects
const getProjects = async (req, res) => {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { techStack: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const projects = await Project.find(query).sort({ createdAt: -1 });
  res.json(projects);
};

// POST /api/projects
const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
};

// PUT /api/projects/:id
// Ensure this is how your update looks in the backend
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    delete data._id; // NEVER update the _id
    console.log(data);
    const updated = await Project.findByIdAndUpdate(id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
