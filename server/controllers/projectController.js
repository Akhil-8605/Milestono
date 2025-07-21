const Project = require("../models/project");
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addProject = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
  
        const { formData } = req.body;
        const images = req.files || [];
  
        const base64images = images.map(file =>
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        );
  
        const newProject = new Project({
          ...JSON.parse(formData),
          features: JSON.parse(formData).features || [],
          images: base64images,
          email: decoded.email 
        });
  
        try {
          const saved = await newProject.save();
          res.status(201).json({ message: 'Project created', id: saved._id });
        } catch (saveErr) {
          console.error(saveErr);
          res.status(500).json({ error: 'Failed to save project' });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create project' });
    }
  };

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getMyProjects = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
  
        const email = decoded.email;
  
        try {
          const projects = await Project.find({ email });
          res.status(200).json({ projects });
        } catch (dbErr) {
          console.error('Error fetching projects:', dbErr);
          res.status(500).json({ error: 'Failed to fetch projects' });
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { formData } = req.body;
    const images = req.files || [];

    const base64images = images.map(file =>
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );

    const updated = await Project.findByIdAndUpdate(
      id,
      {
        ...JSON.parse(formData),
        features: JSON.parse(formData).features || [],
        ...(images.length > 0 && { images: base64images }),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.status(201).json({ message: 'Project updated successfully', project: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
    addProject,
    getAllProjects,
    getMyProjects,
    updateProject,
    deleteProject,
    upload,
};
